import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import {
  activateProfile,
  deleteProfile,
} from "@/lib/profiles/profile-service";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser(request);
    await activateProfile(user.id, params.id);

    return NextResponse.json({ message: "Activated" });
  } catch {
    return NextResponse.json(
      { error: "Activation failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser(request);
    await deleteProfile(user.id, params.id);

    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}