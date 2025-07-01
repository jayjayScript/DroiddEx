'use client';

import PageLoaderComponent from '@/components/Loader';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type LoaderContextType = {
   showPageLoader: () => void;
   hidePageLoader: (delay?: number) => void;
   PageLoader: boolean;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
   const [PageLoader, setPageLoader] = useState(false);

   const showPageLoader = () => {
      document.body.style.overflow = 'hidden';
      setPageLoader(true)
   };
   const hidePageLoader = (delay: number = 0) => {
      document.body.style.overflow = ''
      const timer = setTimeout(() => {
         setPageLoader(false)
      }, delay)
   };

   return (
      <LoaderContext.Provider
         value={{ showPageLoader, hidePageLoader, PageLoader }}
      >
         <div className='relative'>
            {children}
            {PageLoader && <PageLoaderComponent />}
         </div>
      </LoaderContext.Provider>
   );
};

export const useLoader = () => {
   const context = useContext(LoaderContext);
   if (!context) throw new Error('useLoader must be used within LoaderProvider');
   return context;
};
