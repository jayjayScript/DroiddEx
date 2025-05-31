// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await axios.post('http://localhost:4000/auth/login', body);

    return NextResponse.json({ message: 'Login Successful', data: res.data });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    const statusCode = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
