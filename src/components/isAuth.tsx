"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuthStore } from "@/app/store/auth";


export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
      if (!token) {
        return redirect("/");
      }
    }, []);


    if (!token) {
      return null;
    }

    return <Component {...props} />;
  };
}