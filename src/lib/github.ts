import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

async function getFileSha(filePath: string): Promise<string | undefined> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      ref: BRANCH,
    });

    if (!Array.isArray(data) && "sha" in data && data.sha) {
      return data.sha;
    }
  } catch (e: unknown) {
    if ((e as { status?: number }).status !== 404) throw e;
  }
  return undefined;
}

export async function readJsonFile(filePath: string): Promise<unknown> {
  const { data } = await octokit.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: filePath,
    ref: BRANCH,
  });

  if (Array.isArray(data)) throw new Error(`${filePath} is a directory`);

  if (!("content" in data)) {
    throw new Error(`${filePath} is not a regular file`);
  }

  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return JSON.parse(content);
}

export async function commitJsonFile(
  filePath: string,
  content: unknown,
  message: string
): Promise<void> {
  const sha = await getFileSha(filePath);
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString(
    "base64"
  );

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    branch: BRANCH,
    path: filePath,
    message,
    content: encoded,
    sha,
  });
}

export async function commitImageFile(
  filePath: string,
  base64Content: string,
  message: string
): Promise<void> {
  const sha = await getFileSha(filePath);

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    branch: BRANCH,
    path: filePath,
    message,
    content: base64Content,
    sha,
  });
}

export async function listDirectoryFiles(dirPath: string): Promise<string[]> {
  const { data } = await octokit.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: dirPath,
    ref: BRANCH,
  });

  if (!Array.isArray(data)) throw new Error(`${dirPath} is not a directory`);

  return data.filter((item) => item.type === "file").map((item) => item.name);
}
