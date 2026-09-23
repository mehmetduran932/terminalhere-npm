# TerminalHere for npm

[![CI](https://github.com/mehmetduran932/terminalhere-npm/actions/workflows/ci.yml/badge.svg)](https://github.com/mehmetduran932/terminalhere-npm/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Cross-platform file-manager integration for opening a folder in a terminal.

## Install

```powershell
npm install --global @mdsoft2026/terminalhere
terminalhere install
terminalhere status
```

Windows adds Explorer entries beneath `HKCU\\Software\\Classes` without administrator privileges. macOS installs a Finder Quick Action, while Linux installs a Nautilus Script; restart Nautilus after installation if it does not appear immediately.

## Commands

```text
terminalhere install | uninstall | status
terminalhere enable <terminal|powershell|cmd|gitbash|vscode>
terminalhere disable <terminal|powershell|cmd|gitbash|vscode>
terminalhere enable-all | disable-all
terminalhere open [directory]
```

Add `--json` to `status`, `install`, or enable/disable commands for automation.

## Security and project rules

- No administrator privileges are required or requested.
- The package changes only the current user's supported file-manager integration locations.
- Report vulnerabilities privately; see [SECURITY.md](SECURITY.md).
- Contributions follow the fork/PR, branch naming, review, and CI requirements in
  [CONTRIBUTING.md](CONTRIBUTING.md).
- This repository is public, but no npm package has been published from it.

## Development

```bash
npm install
npm test
npm run build
npm pack --dry-run
```

No npm release has been published from this repository.
