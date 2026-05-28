import { auth } from "@/auth";
import { commitImageFile, commitJsonFile, readJsonFile } from "@/lib/github";
import { generatePersonId } from "@/lib/id-generator";
import type { FamilyMember, Person, Tomb } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getAllPersons } = await import("@/lib/data");
    const persons = getAllPersons();
    return NextResponse.json(persons);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch persons" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const dateOfDeath = formData.get("dateOfDeath") as string;
    const tombId = formData.get("tombId") as string;
    const description = formData.get("description") as string;
    const history = formData.get("history") as string;
    const familyMembersJson = formData.get("familyMembers") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name || !dateOfBirth || !dateOfDeath || !tombId || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await generatePersonId();
    let imagePath = "";

    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      imagePath = `/images/persons/${id}.jpg`;
      await commitImageFile(
        `public${imagePath}`,
        base64,
        `feat: add photo for person ${id}`
      );
    }

    let familyMembers: FamilyMember[] = [];
    if (familyMembersJson) {
      try {
        familyMembers = JSON.parse(familyMembersJson);
      } catch {
        familyMembers = [];
      }
    }

    const person: Person = {
      id,
      name,
      dateOfBirth,
      dateOfDeath,
      tombId,
      description,
      imagePath,
      familyMembers,
      history,
      createdAt: new Date().toISOString(),
    };

    await commitJsonFile(
      `data/persons/${id}.json`,
      person,
      `feat: add person ${id}`
    );

    const tombPath = `data/tombs/${tombId}.json`;
    const tombData = (await readJsonFile(tombPath)) as Tomb;
    if (!tombData.personIds.includes(id)) {
      tombData.personIds.push(id);
      await commitJsonFile(
        tombPath,
        tombData,
        `feat: link person ${id} to tomb ${tombId}`
      );
    }

    return NextResponse.json({ success: true, person }, { status: 201 });
  } catch (error) {
    console.error("Person creation error:", error);
    return NextResponse.json(
      { error: "Failed to create person" },
      { status: 500 }
    );
  }
}
