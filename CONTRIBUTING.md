# Contributing to TerminalHere npm

Contributions use the same fork-and-pull-request workflow as the native
[TerminalHere project](https://github.com/mehmetduran932/TerminalHere).

1. Create a descriptive branch: `feature/<name>`, `fix/<name>`, `docs/<name>`,
   `refactor/<name>`, or `test/<name>`.
2. Run `npm run format:check`, `npm run typecheck`, and `npm test` before
   opening a pull request.
3. Use conventional commit messages, such as `feat: add Kitty terminal` or
   `fix: quote Finder paths`.
4. Include the operating system and file manager used for any platform-specific
   change.

Pull requests require review and passing CI before merge. Do not submit direct
changes to protected release branches.
