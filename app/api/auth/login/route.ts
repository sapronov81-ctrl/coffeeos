import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseClient } from "@/lib/db/supabase-client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: error?.message ?? "Login failed" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        access_token: data.session.access_token,
        user: data.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
