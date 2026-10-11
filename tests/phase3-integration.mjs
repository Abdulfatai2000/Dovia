import assert from "node:assert/strict";
import crypto from "node:crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const origin=process.env.DOVIA_TEST_ORIGIN || "http://127.0.0.1:3100";
const marker="dovia-phase3-test-"+crypto.randomUUID();
const userId=new mongoose.Types.ObjectId(), otherId=new mongoose.Types.ObjectId(),workspaceId=new mongoose.Types.ObjectId(),foreignWorkspaceId=new mongoose.Types.ObjectId();
const password=crypto.randomBytes(24).toString("base64url")+"Aa1!",email=marker+"@example.invalid";
const cookies=new Map();
async function request(path,method="GET",body,authenticated=true){
 const response=await fetch(origin+path,{method,redirect:"manual",headers:{...(body?{"Content-Type":"application/json"}:{}),...(authenticated?{Cookie:[...cookies].map(([k,v])=>k+"="+v).join("; ")}: {})},body:body?JSON.stringify(body):undefined});
 for(const cookie of response.headers.getSetCookie()){const pair=cookie.split(";")[0],i=pair.indexOf("=");cookies.set(pair.slice(0,i),pair.slice(i+1));}
 const json=await response.json().catch(()=>null);return {status:response.status,json};
}
async function ok(path,method="GET",body){const result=await request(path,method,body);assert.equal(result.json?.success,true,path+" returned "+result.status+" "+(result.json?.error?.code??""));return result.json.data;}
let db;
try {
 await mongoose.connect(process.env.MONGODB_URI,{dbName:process.env.MONGODB_DB_NAME||"dovia",serverSelectionTimeoutMS:15000});db=mongoose.connection.db;
 const now=new Date(),hash=await bcrypt.hash(password,12);
 await db.collection("users").insertMany([{_id:userId,name:"Phase 3 Test",email,emailNormalized:email,passwordHash:hash,status:"ACTIVE",emailVerifiedAt:now,createdAt:now,updatedAt:now},{_id:otherId,name:"Foreign Test",email:"foreign-"+email,emailNormalized:"foreign-"+email,passwordHash:hash,status:"ACTIVE",emailVerifiedAt:now,createdAt:now,updatedAt:now}]);
 await db.collection("workspaces").insertMany([{_id:workspaceId,name:marker,slug:marker,ownerId:userId,createdAt:now,updatedAt:now},{_id:foreignWorkspaceId,name:marker+"-foreign",slug:marker+"-foreign",ownerId:otherId,createdAt:now,updatedAt:now}]);
 await db.collection("memberships").insertMany([{workspaceId,userId,role:"OWNER",status:"ACTIVE",joinedAt:now},{workspaceId:foreignWorkspaceId,userId:otherId,role:"OWNER",status:"ACTIVE",joinedAt:now}]);
 assert.equal((await request("/api/meetings","GET",undefined,false)).status,401);
 const csrf=await request("/api/auth/csrf");assert.ok(csrf.json.csrfToken);
 const signin=await fetch(origin+"/api/auth/callback/credentials",{method:"POST",redirect:"manual",headers:{"Content-Type":"application/x-www-form-urlencoded",Cookie:[...cookies].map(([k,v])=>k+"="+v).join("; ")},body:new URLSearchParams({csrfToken:csrf.json.csrfToken,email,password,callbackUrl:origin+"/dashboard",json:"true"})});
 for(const cookie of signin.headers.getSetCookie()){const pair=cookie.split(";")[0],i=pair.indexOf("=");cookies.set(pair.slice(0,i),pair.slice(i+1));}
 const session=await request("/api/auth/session");assert.equal(session.json.user?.id,String(userId));
 await ok("/api/dashboard");
 const meeting=await ok("/api/meetings","POST",{title:marker,scheduledAt:new Date(Date.now()+3600000).toISOString(),durationMinutes:30,platform:"OTHER",meetingType:"STANDARD",participantIds:[String(userId)]});
 assert.ok((await ok("/api/meetings")).items.some(item=>item._id===meeting._id));
 assert.equal((await ok("/api/meetings/"+meeting._id)).title,marker);
 await ok("/api/meetings/"+meeting._id,"PATCH",{title:marker+" updated"});
 await ok("/api/meetings/"+meeting._id+"/content","POST",{contentType:"MANUAL_NOTES",rawText:"Integration fixture notes"});
 assert.equal((await ok("/api/meetings/"+meeting._id+"/content")).rawText,"Integration fixture notes");
 assert.equal((await request("/api/tasks","POST",{title:"Foreign assignee",assigneeId:String(otherId)})).status,400);
 const task=await ok("/api/tasks","POST",{title:marker,meetingId:meeting._id,assigneeId:String(userId),dueDate:new Date(Date.now()-86400000).toISOString(),priority:"HIGH",status:"NOT_STARTED"});
 assert.ok((await ok("/api/tasks")).items.some(item=>item._id===task._id));
 let follow=await ok("/api/meetings/"+meeting._id+"/follow-up");assert.equal(follow.totalTasks,1);assert.equal(follow.overdue,1);assert.equal(follow.completionRate,0);
 await ok("/api/tasks/"+task._id,"PATCH",{status:"IN_PROGRESS"});
 const complete=await ok("/api/tasks/"+task._id,"PATCH",{status:"COMPLETED"});assert.ok(complete.completedAt);
 follow=await ok("/api/meetings/"+meeting._id+"/follow-up");assert.equal(follow.completionRate,100);assert.equal(follow.overdue,0);
 const dashboard=await ok("/api/dashboard");assert.equal(dashboard.taskStats.completed,1);
 const from=new Date(Date.now()-3*86400000).toISOString().slice(0,10),to=new Date(Date.now()+3*86400000).toISOString().slice(0,10),range="?from="+from+"&to="+to;
 const calendar=await ok("/api/calendar"+range);assert.ok(calendar.meetings.some(item=>item._id===meeting._id));assert.ok(calendar.taskDeadlines.some(item=>item._id===task._id));
 const report=await ok("/api/reports"+range);assert.equal(report.stats.completed,1);
 assert.equal((await ok("/api/reports?from=2000-01-01&to=2000-01-02")).hasData,false);
 const search=await ok("/api/search?q="+encodeURIComponent(marker));assert.ok(search.groups.some(g=>g.group==="Tasks"));assert.ok(search.groups.some(g=>g.group==="Meetings"));assert.ok((await ok("/api/search?q=Phase%203")).groups.some(g=>g.group==="People"));
 const notifications=await ok("/api/notifications");assert.ok(notifications.items.length);assert.ok(notifications.items.every(item=>item.userId===String(userId)));
 await ok("/api/notifications","PATCH",{id:notifications.items[0]._id,read:true});assert.ok((await ok("/api/notifications")).items.find(item=>item._id===notifications.items[0]._id).readAt);
 await ok("/api/notifications","PATCH",{all:true,read:true});assert.equal((await ok("/api/notifications")).unreadCount,0);
 const foreignTaskId=new mongoose.Types.ObjectId();await db.collection("tasks").insertOne({_id:foreignTaskId,workspaceId:foreignWorkspaceId,title:"foreign",createdBy:otherId,status:"NOT_STARTED",priority:"MEDIUM",source:"MANUAL"});
 assert.equal((await request("/api/tasks/"+foreignTaskId)).status,404);
 const team=await ok("/api/teams","POST",{name:marker,memberIds:[String(userId)]});assert.equal((await ok("/api/teams/"+team._id+"/members")).length,1);
 assert.equal((await request("/api/teams/"+team._id+"/members","POST",{memberIds:[String(otherId)]})).status,400);
 const logoutCsrf=await request("/api/auth/csrf");await fetch(origin+"/api/auth/signout",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Cookie:[...cookies].map(([k,v])=>k+"="+v).join("; ")},body:new URLSearchParams({csrfToken:logoutCsrf.json.csrfToken,json:"true"}),redirect:"manual"});cookies.clear();assert.equal((await request("/api/tasks")).status,401);
 const protectedPage=await fetch(origin+"/dashboard",{redirect:"manual"});assert.ok([302,307].includes(protectedPage.status));
 console.log("PASS: login, meeting/content persistence, tasks, cross-workspace checks, follow-up, notifications, dashboard, reports, calendar, search, teams and logout.");
} catch(error) {console.error("FAIL:",error instanceof assert.AssertionError?error.message:"Integration could not complete. Check local server and database connectivity.");process.exitCode=1;}
finally {if(db){for(const collection of ["meetings","meeting_contents","tasks","activities","notifications","teams","memberships"]){await db.collection(collection).deleteMany({workspaceId:{$in:[workspaceId,foreignWorkspaceId]}});}await db.collection("workspaces").deleteMany({_id:{$in:[workspaceId,foreignWorkspaceId]}});await db.collection("users").deleteMany({_id:{$in:[userId,otherId]}});}await mongoose.disconnect();}
