'use client'
import dynamic from 'next/dynamic'

const LoginPage = dynamic(() => import('./components/UserLogin'), { ssr: false })

export default LoginPage