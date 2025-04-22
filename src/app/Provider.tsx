"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, } from "react";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const Provider = ({ children }: { children: ReactNode }) => {

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </QueryClientProvider>
  );
};

export default Provider;