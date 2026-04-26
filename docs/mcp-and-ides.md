# MCP, IDEs and Git (dev-checklist)

This project follows the [dev-checklist](https://github.com/danielvm-git/dev-checklist) agentic stack. MCP wiring is split by tool surface, but the **intended** servers should stay aligned across files.

## Files by environment (what to keep in sync)

| Environment | Path(s)                                                                                                                              | Committed? |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| Claude Code | [`.mcp.json`](../.mcp.json) (repo root)                                                                                              | Yes        |
| Cursor      | [`.cursor/mcp.json`](../.cursor/mcp.json)                                                                                            | Yes        |
| Antigravity | [`.gemini/antigravity/mcp_config.json`](../.gemini/antigravity/mcp_config.json), [`.gemini/settings.json`](../.gemini/settings.json) | Yes        |

When you add or change an MCP (e.g. Ctxo, context-mode), update **all** of the above that your team uses, or re-run the installer: `install-stack.sh --mode existing --target ./ --env all ...` (or `claude`, `cursor`, `gemini` — see the dev-checklist README).

## What stays out of Git (local tool state)

These remain ignored in [`.gitignore`](../.gitignore); do not ask to “commit to fix the stack”:

- `.claude/`, `.agents/`, `.agent/`, `.artifacts/`, and similar (plugin or session state)
- `.ctxo/.cache/`, `node_modules/`, `.nuxt/`, and other build/cache dirs

## PR checklist for MCP / IDE config changes

1. **No secrets** — no API keys, tokens, or `Authorization` headers in JSON.
2. **No host-only paths** — avoid absolute paths like `/Users/...` or `C:\...` unless the whole team agrees.
3. **Portable commands** — prefer `npx` + published packages, or `command` + args that exist on a normal dev machine.
4. **Parity** — if you change one env file in the table above, update the others for the same intended servers.

## Optional local overrides

If a developer needs a private MCP entry, use a path or filename that is **gitignored** (e.g. a local file referenced only on one machine) or keep overrides outside the committed tree — do not paste secrets into committed files.
