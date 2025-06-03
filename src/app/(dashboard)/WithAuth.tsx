'use client';
import { getUserProfile } from '@/lib/auth';
import { AppDispatch, login, RootState } from '@/store/user';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { email, phrase } = useSelector((state: RootState) => state.user.value);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.replace('/login/');
      return;
    }

    const checkAuth = async () => {
      try {
        // Only fetch if missing state
        if (!email || !phrase) {
          const data = await getUserProfile(); // should handle token
          dispatch(login({ email: data.email, phrase: data.phrase }));
        }
        setChecked(true);
      } catch (error) {
        Cookies.remove('token'); // clear invalid token
        router.replace('/login/');
      }
    };

    checkAuth();
  }, [dispatch, email, phrase, router]);

  if (!checked) return null;

  return <>{children}</>;
};

export default WithAuth;
