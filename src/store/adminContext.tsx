'use client';
import { createContext, useContext, ReactNode, useState } from 'react';

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
   const [admin, setAdmin] = useState<adminType>({} as adminType)
   return (
      <AdminContext.Provider value={{admin, setAdmin}}>
         {children} 
      </AdminContext.Provider>
   )
}

export const useAdminContext = () => {
   const context = useContext(AdminContext);
   if (!context) throw new Error('UserContext does not exist')
   return context;
}