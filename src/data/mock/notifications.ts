import type { DemoNotification } from "@/types/notification";
export const seedNotifications:Omit<DemoNotification,"read">[]=[
 {id:"mention-product",type:"MENTION",category:"Mentions",title:"Mentioned in a meeting discussion",description:"Demo mention: Sarah asked for your input on Product Strategy Sync.",timestamp:"2026-10-05T08:00:00Z",meetingId:"meeting-product-strategy",href:"/meetings/meeting-product-strategy"},
 {id:"system-demo",type:"SYSTEM",category:"System",title:"Welcome to the Dovia demo",description:"Updates are generated from local demo records. No push notifications or emails are sent.",timestamp:"2026-10-01T08:00:00Z",href:"/settings"},
];
