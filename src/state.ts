const STATE_FILE = "state.json";

export interface FeedState {
  raw: string;
  lastChecked: string;
}

export type StateFile = Record<string, FeedState>;

export async function loadState(): Promise<StateFile> {
  try {
    const text = await Bun.file(STATE_FILE).text();
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function saveState(state: StateFile): Promise<void> {
  await Bun.write(STATE_FILE, JSON.stringify(state, null, 2));
}
