import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db/supabase-server";
import { createUserRecord } from "@/lib/auth/create-user";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? "User creation failed" },
        { status: 400 }
      );
    }

    await createUserRecord(data.user.id);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
