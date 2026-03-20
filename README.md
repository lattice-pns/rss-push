# rss-push

Polls RSS/Atom feeds on a cron schedule and pushes any changes to [pns.1lattice.co](https://pns.1lattice.co).

## How it works

1. Fetches the raw feed text on each scheduled tick
2. Diffs it against the previously stored fetch
3. If there are changes, POSTs the diff to `https://pns.1lattice.co/push/<token>`
4. Saves the latest raw feed to `state.json`

On first run, the full feed is pushed since there's nothing to compare against.

## Getting started

**Prerequisites:** [Bun](https://bun.sh)

```bash
bun install
cp config.example.json config.json
```

Edit `config.json` with your feeds and push tokens:

```json
{
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

| Field      | Description                     |
| ---------- | ------------------------------- |
| `url`      | RSS or Atom feed URL            |
| `schedule` | Cron expression (UTC)           |
| `token`    | Push token from pns.1lattice.co |

Multiple feeds are supported — each gets its own schedule and token.

## Files

- `config.json` — your config (gitignored)
- `state.json` — auto-managed, stores the last raw fetch per feed (gitignored)
