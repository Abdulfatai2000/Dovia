"use client";
import { useDemoQuery } from "./use-demo-query";
import { getNotifications } from "@/services/notification.service";
export function useNotifications(){const state=useDemoQuery(getNotifications);const notifications=state.data??[];return {...state,notifications,unread:notifications.filter(item=>!item.read).length};}
