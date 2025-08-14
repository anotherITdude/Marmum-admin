'use client'
import React from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className="border-b">
      <div className="flex h-16 justify-between items-center px-4">
        <div className="text-sm md:text-md">
          Marmum campaign 2025 - Admin Dashboard
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
