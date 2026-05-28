import { auth } from "@/auth";
import { commitImageFile, commitJsonFile } from "@/lib/github";
import type { FamilyMember, Person } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { getPersonById } = await import("@/lib/data");
    const person = getPersonById(id);

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json(person);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch person" },
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
    const formData = await req.formData();

    const { getPersonById } = await import("@/lib/data");
    const person = getPersonById(id);
    if (!person) {
      return NextResponse.json(
        { error: "Person not found" },
        { status: 404 }
      );
    }

    const name = (formData.get("name") as string) || person.name;
    const dateOfBirth =
      (formData.get("dateOfBirth") as string) || person.dateOfBirth;
    const dateOfDeath =
      (formData.get("dateOfDeath") as string) || person.dateOfDeath;
    const description = (formData.get("description") as string) || person.description;
    const history = (formData.get("history") as string) || person.history;
    const familyMembersJson = formData.get("familyMembers") as string;
    const imageFile = formData.get("image") as File | null;

    let imagePath = person.imagePath;
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      imagePath = `/images/persons/${id}.jpg`;
      await commitImageFile(
        `public${imagePath}`,
        base64,
        `feat: update photo for person ${id}`
      );
    }

    let familyMembers: FamilyMember[] = person.familyMembers;
    if (familyMembersJson) {
      try {
        familyMembers = JSON.parse(familyMembersJson);
      } catch {
        familyMembers = person.familyMembers;
      }
    }

    const updated: Person = {
      ...person,
      name,
      dateOfBirth,
      dateOfDeath,
      description,
      imagePath,
      familyMembers,
      history,
    };

    await commitJsonFile(
      `data/persons/${id}.json`,
      updated,
      `feat: update person ${id}`
    );

    return NextResponse.json({ success: true, person: updated });
  } catch (error) {
    console.error("Person update error:", error);
    return NextResponse.json(
      { error: "Failed to update person" },
      { status: 500 }
    );
  }
}
