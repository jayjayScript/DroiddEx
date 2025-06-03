'use client'
import dynamic from 'next/dynamic'

const LoginPage = dynamic(() => import('./components/LoginComponent'), { ssr: false })

export default LoginPage
