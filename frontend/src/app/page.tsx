"use client";
import { redirect } from "next/navigation";
import { supabase } from "@/app/util/supabaseClient";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is logged in using Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        redirect("/signin");
      } else {
        redirect("/dashboard");
      }
    };

    checkAuth();
  }, []);
  return null;
}
