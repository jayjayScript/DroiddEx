"use client";
import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';


const Waker = ({ children }: { children: React.ReactNode }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 10;
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const fetchData = async () => {
            while (attempts < maxAttempts) {
                try {
                    const greetData = await api({});
                    console.log(greetData);
                    setLoaded(true);
                    break; // Exit loop on success
                } catch (err) {
                    attempts++;
                    if (err instanceof AxiosError) {
                        toast.error(err.response?.data.message ?? "No Internet Connection, Please try again later");
                    } else {
                        toast.error('An error occurred, please reload');
                    }
                    if (attempts >= maxAttempts) break;
                    await delay(3000); // Wait 3 seconds before retrying
                }
            }
        };

        fetchData();
    }, []);

    return <>{children} <span className='hidden'>{loaded}</span></>;
}

export default Waker