# rss-push

Polls RSS/Atom feeds on a cron schedule and pushes any changes to [pns.1lattice.co](https://pns.1lattice.co).

## How it works

1. Fetches the raw feed text on each scheduled tick
2. Diffs it against the previously stored fetch
3. If there are changes, counts how many lines are in the diff (new lines not in the previous fetch); only if that count is at least `minLineChanges` (default 5) does it POST the diff to `https://pns.1lattice.co/push/<token>`
4. Saves the latest raw feed to `state.json` (including after skipped pushes, so minor churn does not re-trigger forever)

On first run, the full feed is pushed since there's nothing to compare against (unless the feed is extremely short).

## Getting started

**Prerequisites:** [Bun](https://bun.sh)

```bash
bun install
cp config.example.json config.json
```

Edit `config.json` with your feeds and push tokens:

```json
{
  "minLineChanges": 5,
  "feeds": [
    {
      "url": "https://techcrunch.com/feed/",
      "schedule": "*/5 * * * *",
      "token": "your-push-token-here"
    }
  ]
}
```

Then run:

```bash
bun run src/main.ts
```

## Config

| Field            | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| `minLineChanges` | Optional. Minimum lines in the diff before sending a push (default `5`). |
| `url`            | RSS or Atom feed URL                                                     |
| `schedule`       | Cron expression (UTC)                                                    |
| `token`          | Push token from pns.1lattice.co                                          |

Per-feed `minLineChanges` overrides the top-level value for that feed only.

Multiple feeds are supported — each gets its own schedule and token.

## Files

- `config.json` — your config (gitignored)
- `state.json` — auto-managed, stores the last raw fetch per feed (gitignored)
