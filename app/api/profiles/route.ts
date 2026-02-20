import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import {
  getUserProfiles,
  createProfile,
} from "@/lib/profiles/profile-service";

export async function GET() {
  try {
    const user = await requireUser();
    const profiles = await getUserProfiles(user.id);

    return NextResponse.json(profiles);
  } catch (error: any) {
    if (error instanceof Response) {
      return error;
    }

    console.error("GET /api/profiles error:", error);

    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json();

    if (!body?.name) {
      return NextResponse.json(
        { error: "Profile name is required" },
        { status: 400 }
      );
    }

    await createProfile(user.id, body.name);

    return NextResponse.json({ message: "Profile created" });
  } catch (error: any) {
    if (error instanceof Response) {
      return error;
    }

    if (
      error.message ===
      "Profile limit reached for your subscription plan"
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    console.error("POST /api/profiles error:", error);

    return NextResponse.json(
      { error: "Profile creation failed" },
      { status: 500 }
    );
  }
}