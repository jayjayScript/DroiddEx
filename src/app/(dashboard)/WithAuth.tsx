"use client";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLoader } from "@/store/LoaderContext";
import { useUserContext } from "@/store/userContext";
import api from "@/lib/axios";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useUserContext();
  const { showPageLoader, hidePageLoader, PageLoader } = useLoader();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double-run in React Strict Mode or from unstable deps
    if (hasRun.current) return;
    hasRun.current = true;

    const getUser = async () => {
      showPageLoader();
      const userToken = Cookies.get("token");

      if (!userToken) {
        hidePageLoader();
        router.replace("/login");
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        const response = await api.get<UserType>("/profile/");
        setUser(response.data);
        hidePageLoader();
        setAuthChecked(true);
        if (response.data.isVerified === false) {
          router.replace("/settings/");
        }
      } catch (error) {
        hidePageLoader();
        console.error("Error fetching user profile:", error);
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        // Only force logout on explicit 401 Unauthorized
        if (status === 401) {
          Cookies.remove("token");
          router.replace("/login");
        } else {
          // Network error or server issue — don't log out, just mark auth as checked
          // so we show the page. The user is still logged in (token exists).
          setAuthChecked(true);
        }
      }
    };

    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array — run once on mount only

  if (PageLoader || !authChecked) {
    return null; // or return a spinner/loading UI
  }

  return <>{children}</>;
};

export default WithAuth;
