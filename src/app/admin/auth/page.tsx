'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LoginComponent = dynamic(() => import('./components/LoginComponent'), { ssr: false });

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-8">Loading login page...</div>}>
      <LoginComponent />
    </Suspense>
  );
}

