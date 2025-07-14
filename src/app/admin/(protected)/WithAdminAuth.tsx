'use client';
import { useLoader } from '@/store/LoaderContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import api from '@/lib/axios';
import { useAdminContext } from '@/store/adminContext';

const WithAdminAuth = ({ children }: { children: React.ReactNode }) => {
   const { showPageLoader, hidePageLoader } = useLoader()
   const { setAdmin } = useAdminContext()
   const router = useRouter();
   useEffect(() => {
      const getAdmin = async () => {
         showPageLoader()
         const adminToken = Cookies.get("adminToken");

         if (!adminToken) {
            router.replace("/admin/auth/");
            return;
         }
         try {
            api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
            const response = await api.get<adminType>("/admin/");
            setAdmin(response.data)
            hidePageLoader()
         } catch (error) {
            hidePageLoader()
            console.error("Error fetching user profile:", error);
            router.replace("/admin/auth/");
         }
      }
      getAdmin()
   }, [router])
   return (
      <>
         {children}
      </>
   )
}

export default WithAdminAuth