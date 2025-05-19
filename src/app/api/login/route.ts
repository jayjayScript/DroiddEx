import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "admin@example.com" && password === "admin123") {
    const response = NextResponse.json({
      success: true,
      message: "Admin Login successful",
    });

    response.cookies.set("token", "mock-token", { httpOnly: true, path: "/" });
    response.cookies.set("role", "admin", { httpOnly: true, path: "/" });

    return response;
  }

  if(email === "user@example.com" && password === "user123") {
    const response = NextResponse.json({
      success: true,
      message: "User Login successful",
    });

    response.cookies.set("token", "mock-token", { httpOnly: true, path: "/" });
    response.cookies.set("role", "user", { httpOnly: true, path: "/" });

    return response;
  }

  return NextResponse.json({
    success: false, message: "Not authorized",
  }, { status: 401 });
}
