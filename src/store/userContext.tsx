'use client';
import { createContext, useContext, ReactNode, useState } from 'react';



const userContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<UserType>({} as UserType)
   return (
      <userContext.Provider value={{user, setUser}}>
         {children} 
      </userContext.Provider>
   )
}

export const useUserContext = () => {
   const context = useContext(userContext);
   if (!context) throw new Error('UserContext does not exist')
   return context;
}