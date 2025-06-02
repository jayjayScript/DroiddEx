'use client';
import { getUserProfile } from '@/lib/auth';
import { AppDispatch, login, RootState } from '@/store/user';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { value } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [checked, setChecked] = useState(false);

  const token = Cookies.get('token')
  if (!token) {
    router.replace('/login/')
  }

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!value?.email || !value?.phrase) {
        try {
          const data = await getUserProfile();
          if (isMounted) {
            dispatch(login(data));
            setChecked(true);
          }
        } catch (error) {
          if (isMounted) router.replace('/login/');
        }
      } else {
        setChecked(true);
      }
    };

    checkAuth();

    return () => {
      isMounted = false; // prevent state updates after unmount
    };
  }, [value, dispatch, router]);

  if (!checked) return null;

  return <>{children}</>;
};

export default WithAuth;

