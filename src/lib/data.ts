import fs from "fs";
import path from "path";
import type { Person, Tomb } from "@/types";

const dataRoot = path.join(process.cwd(), "data");

export function getAllTombs(): Tomb[] {
  const dir = path.join(dataRoot, "tombs");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Tomb)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getTombById(id: string): Tomb | null {
  const filePath = path.join(dataRoot, "tombs", `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Tomb;
}

export function getAllPersons(): Person[] {
  const dir = path.join(dataRoot, "persons");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map(
      (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Person
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPersonById(id: string): Person | null {
  const filePath = path.join(dataRoot, "persons", `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Person;
}

export function getPersonsByTombId(tombId: string): Person[] {
  return getAllPersons().filter((p) => p.tombId === tombId);
}
