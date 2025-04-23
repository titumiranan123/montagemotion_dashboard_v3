/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { getSession } from "next-auth/react";
export const api_url = axios.create({
  baseURL: 'http://localhost:8000',
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api_url.interceptors.request.use(async (config) => {
  const session:any = await getSession(); 
  console.log(session?.user?.token,"sesson")
  if (session?.user?.token) {
    config.headers.Authorization = `Bearer ${session?.user?.token}`;
  }
  return config;
});