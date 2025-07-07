'use client';
import { createContext, useContext, ReactNode, useState } from 'react';

const allUsersContext = createContext<AllUserContextType>({} as AllUserContextType);

export const AllUsersProvider = ({ children }: { children: ReactNode }) => {
   const [allUsers, setAllUsers] = useState<UserType[]>([] as UserType[])
   return (
      <allUsersContext.Provider value={{allUsers, setAllUsers}}>
         {children} 
      </allUsersContext.Provider>
   )
}

export const useAllUsersContext = () => {
   const context = useContext(allUsersContext);
   if (!context) throw new Error('allUsersContext does not exist')
   return context;
}