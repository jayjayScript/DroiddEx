import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Payload to backend:', body); // Add this

        const res = await axios.post('http://localhost:4000/auth/signup', body, {
            headers: { 'Content-Type': 'application/json' },
        });

        return NextResponse.json({ message: "Signup Successful", data: res.data });
    } catch (error: any) {
        console.error('Signup error:', error); // Add this
        const errorMessage = error.response?.data?.message || 'Signup Failed';
        const statusCode = error.response?.status || 500;
        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}


