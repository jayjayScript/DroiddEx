// /app/api/verify/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        const res = await axios.post('http://localhost:4000/auth/verify', {
            email,
            code,
        });

        return NextResponse.json({ message: 'Verification successful', data: res.data });
    } catch (error: any) {
        const message = error.response?.data?.message || 'Verification failed';
        return NextResponse.json({ message }, { status: error.response?.status || 500 });
    }
}
