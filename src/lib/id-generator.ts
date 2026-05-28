import { listDirectoryFiles } from "./github";

export async function generatePersonId(): Promise<string> {
  try {
    const files = await listDirectoryFiles("data/persons");
    if (files.length === 0) return "P001";

    const nums = files
      .filter((f) => f.endsWith(".json"))
      .map((f) => parseInt(f.replace("P", "").replace(".json", ""), 10))
      .filter((n) => !isNaN(n));

    const max = nums.length > 0 ? Math.max(...nums) : 0;
    return `P${String(max + 1).padStart(3, "0")}`;
  } catch {
    // If directory doesn't exist or API fails, start from P001
    return "P001";
  }
}

export async function generateTombId(): Promise<string> {
  try {
    const files = await listDirectoryFiles("data/tombs");
    if (files.length === 0) return "T001";

    const nums = files
      .filter((f) => f.endsWith(".json"))
      .map((f) => parseInt(f.replace("T", "").replace(".json", ""), 10))
      .filter((n) => !isNaN(n));

    const max = nums.length > 0 ? Math.max(...nums) : 0;
    return `T${String(max + 1).padStart(3, "0")}`;
  } catch {
    // If directory doesn't exist or API fails, start from T001
    return "T001";
  }
}
