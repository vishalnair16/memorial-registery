import { auth } from "@/auth";
import { commitJsonFile } from "@/lib/github";
import type { Tomb } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { getTombById } = await import("@/lib/data");
    const tomb = getTombById(id);

    if (!tomb) {
      return NextResponse.json({ error: "Tomb not found" }, { status: 404 });
    }

    return NextResponse.json(tomb);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tomb" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { location, personIds } = body as {
      location: string;
      personIds: string[];
    };

    const { getTombById } = await import("@/lib/data");
    const tomb = getTombById(id);
    if (!tomb) {
      return NextResponse.json({ error: "Tomb not found" }, { status: 404 });
    }

    const updated: Tomb = {
      ...tomb,
      location: location || tomb.location,
      personIds: personIds || tomb.personIds,
    };

    await commitJsonFile(
      `data/tombs/${id}.json`,
      updated,
      `feat: update tomb ${id}`
    );

    return NextResponse.json({ success: true, tomb: updated });
  } catch (error) {
    console.error("Tomb update error:", error);
    return NextResponse.json(
      { error: "Failed to update tomb" },
      { status: 500 }
    );
  }
}
