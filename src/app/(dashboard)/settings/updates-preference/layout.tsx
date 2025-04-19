"use client";
import React from "react";


const IntegrationsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" space-y-6 bg-white  rounded-lg shadow-sm w-full">
      
      {children}
    </div>
  );
};

export default IntegrationsLayout;