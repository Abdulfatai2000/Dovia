"use client";
import { getMeetings } from "@/services/meeting.service";
import { useDemoQuery } from "./use-demo-query";
export function useMeetings(){const state=useDemoQuery(getMeetings);return {...state,meetings:state.data??[]};}
