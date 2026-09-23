import { execFile as execFileCallback } from 'node:child_process';
import { chmod, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { ContextMenuService } from './service.js';
import { RegExeClient } from './registry.js';
import type { TerminalStatus, TerminalTarget } from './types.js';

const execFile = promisify(execFileCallback);
const macWorkflow = join(homedir(), 'Library', 'Services', 'TerminalHere.workflow');
const linuxScript = join(homedir(), '.local', 'share', 'nautilus', 'scripts', 'TerminalHere');
const finderWorkflow = ['<?xml version="1.0" encoding="UTF-8"?>', '<plist version="1.0"><dict>', '<key>AMWorkflowType</key><string>Service</string>', '<key>ServiceApplicationBundleIdentifier</key><string>com.apple.finder</string>', '<key>ServiceInputTypeIdentifier</key><string>com.apple.cocoa.path</string>', '<key>ServiceOutputTypeIdentifier</key><string>com.apple.cocoa.path</string>', '</dict></plist>'].join('');
const nautilusScript = ['#!/bin/sh', 'for target in "$@"; do', '  if command -v xdg-terminal-exec >/dev/null 2>&1; then xdg-terminal-exec --working-directory="$target" && continue; fi', '  if command -v gnome-terminal >/dev/null 2>&1; then gnome-terminal --working-directory="$target" && continue; fi', '  if command -v konsole >/dev/null 2>&1; then konsole --workdir "$target" && continue; fi', '  xterm -e sh -lc \'cd "$1"; exec "$SHELL"\' sh "$target"', 'done', ''].join('\n');

function asStatus(target: TerminalTarget, displayName: string, enabled: boolean): TerminalStatus {
  return { target, displayName, registryKeyName: 'TerminalHere', installed: true, enabled };
}
async function fileExists(path: string): Promise<boolean> { try { await stat(path); return true; } catch { return false; } }

export class PlatformIntegration {
  private readonly windows = new ContextMenuService(new RegExeClient());
  async install(target: TerminalTarget = 'terminal'): Promise<TerminalStatus[]> {
    if (process.platform === 'win32') return target === 'terminal' ? this.windows.enableAll() : [await this.windows.enable(target)];
    if (target !== 'terminal') throw new Error(`${target} is currently supported on Windows only.`);
    if (process.platform === 'darwin') { const document = join(macWorkflow, 'Contents', 'document.wflow'); await mkdir(dirname(document), { recursive: true }); await writeFile(document, finderWorkflow); return [asStatus('terminal', 'Finder Quick Action: TerminalHere', true)]; }
    if (process.platform === 'linux') { await mkdir(dirname(linuxScript), { recursive: true }); await writeFile(linuxScript, nautilusScript); await chmod(linuxScript, 0o755); return [asStatus('terminal', 'Nautilus Script: TerminalHere', true)]; }
    throw new Error(`Unsupported platform: ${process.platform}`);
  }
  async uninstall(target: TerminalTarget = 'terminal'): Promise<TerminalStatus[]> {
    if (process.platform === 'win32') return target === 'terminal' ? this.windows.disableAll() : [await this.windows.disable(target)];
    if (target !== 'terminal') throw new Error(`${target} is currently supported on Windows only.`);
    const path = process.platform === 'darwin' ? macWorkflow : process.platform === 'linux' ? linuxScript : undefined;
    if (!path) throw new Error(`Unsupported platform: ${process.platform}`);
    await rm(path, { recursive: true, force: true });
    return [asStatus('terminal', process.platform === 'darwin' ? 'Finder Quick Action: TerminalHere' : 'Nautilus Script: TerminalHere', false)];
  }
  async getStatus(target?: TerminalTarget): Promise<TerminalStatus[]> {
    if (process.platform === 'win32') return target ? [await this.windows.status(target)] : this.windows.allStatuses();
    if (target && target !== 'terminal') return [{ target, displayName: target, registryKeyName: 'TerminalHere', installed: false, enabled: false }];
    if (process.platform === 'darwin') return [asStatus('terminal', 'Finder Quick Action: TerminalHere', await fileExists(macWorkflow))];
    if (process.platform === 'linux') return [asStatus('terminal', 'Nautilus Script: TerminalHere', await fileExists(linuxScript))];
    return [{ target: 'terminal', displayName: 'TerminalHere', registryKeyName: 'TerminalHere', installed: false, enabled: false }];
  }
  async open(directory = process.cwd()): Promise<void> {
    if (process.platform === 'win32') { await execFile('wt.exe', ['-d', directory]); return; }
    if (process.platform === 'darwin') { await execFile('open', ['-a', 'Terminal', directory]); return; }
    if (process.platform === 'linux') { try { await execFile('xdg-terminal-exec', [`--working-directory=${directory}`]); } catch { await execFile('gnome-terminal', [`--working-directory=${directory}`]); } return; }
    throw new Error(`Unsupported platform: ${process.platform}`);
  }
}
