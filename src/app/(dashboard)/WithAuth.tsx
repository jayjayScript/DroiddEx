"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLoader } from "@/store/LoaderContext";
import { useUserContext } from "@/store/userContext";
import api from "@/lib/axios";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const {user, setUser} = useUserContext()
  const { showPageLoader, hidePageLoader, PageLoader } = useLoader()
  const router = useRouter();

  useEffect(() => {
    showPageLoader()
    const getUser = async () => {
      const userToken = Cookies.get("token");

      if (!userToken) {
        router.replace("/login");
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        const response = await api.get<UserType>("/profile/");
        setUser(response.data);
        hidePageLoader()
        if(user.isVerified === false){
          router.replace('/settings/')
        }
      } catch (error) {
        hidePageLoader()
        console.error("Error fetching user profile:", error);
        router.replace("/login");
      }
    };

    getUser();
  }, [router]);

  if (PageLoader || !user) {
    return null; // or return a spinner/loading UI
  }

  return (
    <>
      {children}
    </>
  );
};

export default WithAuth;
