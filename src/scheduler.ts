import { Cron } from "croner";
import { fetchRaw } from "./rss";
import { pushDiff } from "./push";
import { saveState } from "./state";
import type { StateFile } from "./state";

interface FeedConfig {
  url: string;
  schedule: string;
  token: string;
}

interface Config {
  feeds: FeedConfig[];
}

function diff(oldText: string, newText: string): string {
  const oldLines = new Set(oldText.split("\n"));
  return newText
    .split("\n")
    .filter((line) => !oldLines.has(line))
    .join("\n");
}

export async function pollFeed(
  feed: FeedConfig,
  state: StateFile
): Promise<void> {
  console.log(`[poll] Checking ${feed.url}`);
  let raw: string;
  try {
    raw = await fetchRaw(feed.url);
  } catch (err) {
    console.error(`[poll] Failed to fetch ${feed.url}:`, err);
    return;
  }

  const prevRaw = state[feed.url]?.raw;

  const changes = diff(prevRaw ?? "", raw);

  if (!changes) {
    console.log(`[poll] No change for ${feed.url}`);
    return;
  }

  await pushDiff(feed.token, feed.url, changes);

  state[feed.url] = { raw, lastChecked: new Date().toISOString() };
  await saveState(state);
}

export function startScheduler(config: Config, state: StateFile): void {
  for (const feed of config.feeds) {
    console.log(
      `[scheduler] Registering ${feed.url} on schedule "${feed.schedule}"`
    );
    new Cron(feed.schedule, { timezone: "UTC" }, () => {
      pollFeed(feed, state).catch((err) =>
        console.error(`[scheduler] Unhandled error for ${feed.url}:`, err)
      );
    });
  }
}
