import { auth } from "@/auth";
import { commitJsonFile } from "@/lib/github";
import { generateTombId } from "@/lib/id-generator";
import type { Tomb } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getAllTombs } = await import("@/lib/data");
    const tombs = getAllTombs();
    return NextResponse.json(tombs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tombs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { location } = body as { location: string };

    if (!location || location.trim().length === 0) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    const id = await generateTombId();
    const tomb: Tomb = {
      id,
      location,
      personIds: [],
      createdAt: new Date().toISOString(),
    };

    await commitJsonFile(`data/tombs/${id}.json`, tomb, `feat: add tomb ${id}`);

    return NextResponse.json({ success: true, tomb }, { status: 201 });
  } catch (error) {
    console.error("Tomb creation error:", error);
    return NextResponse.json(
      { error: "Failed to create tomb" },
      { status: 500 }
    );
  }
}
