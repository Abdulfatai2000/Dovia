import { apiFetch } from "@/lib/api-client";
export const searchGroups=["Meetings","Tasks","People","Decisions"] as const;
export type SearchGroup=typeof searchGroups[number];
export interface SearchResult {id:string;group:SearchGroup;title:string;context:string;href:string}
export interface SearchGroupsResult {query:string;groups:{group:SearchGroup;results:SearchResult[]}[];total:number}
export async function searchWorkspace(query:string):Promise<SearchGroupsResult>{if(!query.trim())return {query,groups:[],total:0};return apiFetch("/api/search?"+new URLSearchParams({q:query}));}
