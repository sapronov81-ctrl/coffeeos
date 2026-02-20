import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("sb-access-token", accessToken, {
      httpOnly: true,
      secure: false, // В production ОБЯЗАТЕЛЬНО true
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 день
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set session" },
      { status: 500 }
    );
  }
}
