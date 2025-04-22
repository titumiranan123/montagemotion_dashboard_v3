"use client"
import React, { ReactNode } from "react";
import Provider from "../Provider";
import MainLayout from "@/component/Mainlayout";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <MainLayout>{children}</MainLayout>
    </Provider>
  );
};

export default PublicLayout;
