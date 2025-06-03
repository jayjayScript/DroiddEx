"use client";
import React, { useEffect } from 'react'
import api from './lib/axios';


const Waker = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {
        const greet = async () => {
            try {
                const greetData = await api({})
                console.log(greetData)
            } catch (error) {
                console.log(error)
            }
        }

        greet()
    }, [])
  return (
    <>{children}</>
  )
}

export default Waker