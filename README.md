# TerminalHere for npm

Cross-platform file-manager integration for opening a folder in a terminal.

## Install

```powershell
npm install --global @mehmetduran/terminalhere
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

## Development

```bash
npm install
npm test
npm run build
npm pack --dry-run
```

No npm release has been published from this repository.
