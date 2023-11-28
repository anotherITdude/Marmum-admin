'use client'
import React from "react";
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 justify-between items-center px-4">
        <div className="text-sm md:text-md">
          Alain Iphone Campaign November 2023
        </div>
        <div className="bg-red-500 rounded-full p-[2px]">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
