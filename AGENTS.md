# Agent instructions

Load skills from [`.agents`](.agents/README.md). That folder is the source of truth for every coding agent. `.cursor/` is local-only.

Always apply [no-unsolicited-changes](.agents/skills/no-unsolicited-changes/SKILL.md).

Also load a skill when its description matches the task:

- [imports](.agents/skills/imports/SKILL.md)
- [update-readme-todos](.agents/skills/update-readme-todos/SKILL.md)
- [test-structure](.agents/skills/test-structure/SKILL.md)

When working in `src/ui/web`, also load [react-router](src/ui/web/.agents/skills/react-router/SKILL.md).
