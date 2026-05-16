## ctxo MCP Tool Usage (MANDATORY)

**ALWAYS use ctxo MCP tools before reading source files or making code changes.** The ctxo index contains dependency graphs, git intent, anti-patterns, and change health that cannot be derived from reading files alone. Skipping these tools leads to blind edits and broken dependencies.

### Before ANY Code Modification

1. Call `get_blast_radius` for the symbol you are about to change — understand what breaks
2. Call `get_why_context` for the same symbol — check for revert history or anti-patterns
3. Only then read and edit source files

### Before Starting a Task

| Task Type                  | REQUIRED First Call                            |
| -------------------------- | ---------------------------------------------- |
| Fixing a bug               | `get_context_for_task(taskType: "fix")`        |
| Adding/extending a feature | `get_context_for_task(taskType: "extend")`     |
| Refactoring                | `get_context_for_task(taskType: "refactor")`   |
| Understanding code         | `get_context_for_task(taskType: "understand")` |

### Before Reviewing a PR or Diff

- Call `get_pr_impact` — single call gives full risk assessment with co-change analysis

### When Exploring or Searching Code

- Use `search_symbols` for name/regex lookup — DO NOT grep source files for symbol discovery
- Use `get_ranked_context` for natural language queries — DO NOT manually browse directories

### Orientation in Unfamiliar Areas

- Call `get_architectural_overlay` to understand layer boundaries
- Call `get_symbol_importance` to identify critical symbols

### NEVER Do These

- NEVER edit a function without first calling `get_blast_radius` on it
- NEVER skip `get_why_context` — reverted code and anti-patterns are invisible without it
- NEVER grep source files to find symbols when `search_symbols` exists
- NEVER manually trace imports when `find_importers` gives the full reverse dependency graph

## Superpowers Skills (MANDATORY)

This project uses the **Superpowers** skills library for agentic workflows. You MUST follow these processes:

1.  **Brainstorming**: BEFORE starting any implementation, call `superpowers:brainstorming`. Explore context deeply and get approval on a "Visual Companion" (implementation plan).
2.  **Plan Execution**: Use `superpowers:subagent-driven-development` to execute plans. Dispatch isolated sub-agents and enforce reviews for each task.
3.  **TDD**: Follow the Red-Green-Refactor cycle as defined in `superpowers:test-driven-development`. No production code without a failing test.
4.  **Debugging**: Use `superpowers:systematic-debugging`. Prohibit fixing symptoms; find the root cause first.

Refer to the individual skill files in `.agents/skills/` for detailed instructions.
