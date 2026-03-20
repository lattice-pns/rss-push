import { loadState } from "./state";
import { startScheduler } from "./scheduler";
import config from "../config.json";

const state = await loadState();
startScheduler(config, state);

console.log("[main] Scheduler started. Press Ctrl+C to stop.");
