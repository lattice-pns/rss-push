const PUSH_BASE = "https://pns.1lattice.co/push";

export async function pushDiff(
  token: string,
  feedUrl: string,
  diff: string
): Promise<void> {
  const url = `${PUSH_BASE}/${token}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feed: feedUrl, diff }),
    });
    if (!res.ok) {
      console.error(
        `[push] HTTP ${res.status} for token ${token}: ${await res.text()}`
      );
    } else {
      console.log(`[push] Sent diff for ${feedUrl}`);
    }
  } catch (err) {
    console.error(`[push] Failed to push for ${feedUrl}:`, err);
  }
}
