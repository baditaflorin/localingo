import { z } from 'zod';

const commitSchema = z.object({
  sha: z.string(),
  html_url: z.string(),
  commit: z.object({
    committer: z.object({
      date: z.string()
    })
  })
});

export interface GitHubCommitInfo {
  shortSha: string;
  url: string;
  date: string;
}

export async function fetchMainCommit(repository: string): Promise<GitHubCommitInfo> {
  const response = await fetch(`https://api.github.com/repos/${repository}/commits/main`, {
    headers: {
      Accept: 'application/vnd.github+json'
    }
  });
  if (!response.ok) {
    throw new Error(`GitHub commit lookup failed: ${response.status}`);
  }
  const data = commitSchema.parse(await response.json());
  return {
    shortSha: data.sha.slice(0, 7),
    url: data.html_url,
    date: data.commit.committer.date
  };
}
