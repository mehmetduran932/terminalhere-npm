import { access } from 'node:fs/promises';
import { delimiter, join } from 'node:path';
import type { AppInfo, TerminalTarget } from './types.js';

const targetDetails: Record<TerminalTarget, Omit<AppInfo, 'executablePath' | 'iconPath'>> = {
  terminal: { target: 'terminal', displayName: 'Open in Terminal', registryKeyName: 'TerminalHere.WindowsTerminal' },
  powershell: { target: 'powershell', displayName: 'Open in PowerShell', registryKeyName: 'TerminalHere.PowerShell' },
  cmd: { target: 'cmd', displayName: 'Open in Command Prompt', registryKeyName: 'TerminalHere.CommandPrompt' },
  gitbash: { target: 'gitbash', displayName: 'Open in Git Bash', registryKeyName: 'TerminalHere.GitBash' },
  vscode: { target: 'vscode', displayName: 'Open in VS Code', registryKeyName: 'TerminalHere.VSCode' }
};

const candidates: Record<TerminalTarget, string[]> = {
  terminal: [],
  powershell: [],
  cmd: process.env.ComSpec ? [process.env.ComSpec] : [],
  gitbash: [
    'C:\\Program Files\\Git\\git-bash.exe',
    'C:\\Program Files (x86)\\Git\\git-bash.exe'
  ],
  vscode: [
    join(process.env.LOCALAPPDATA ?? '', 'Programs', 'Microsoft VS Code', 'Code.exe'),
    'C:\\Program Files\\Microsoft VS Code\\Code.exe'
  ]
};

async function exists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

async function findOnPath(names: string[]): Promise<string | undefined> {
  const paths = (process.env.PATH ?? '').split(delimiter).filter(Boolean);
  for (const directory of paths) {
    for (const name of names) {
      const candidate = join(directory, name);
      if (await exists(candidate)) return candidate;
    }
  }
  return undefined;
}

export async function detectApp(target: TerminalTarget): Promise<AppInfo> {
  const details = targetDetails[target];
  const pathNames: Record<TerminalTarget, string[]> = {
    terminal: ['wt.exe'], powershell: ['powershell.exe'], cmd: ['cmd.exe'], gitbash: ['git-bash.exe'], vscode: ['Code.exe']
  };
  const executablePath = await findOnPath(pathNames[target])
    ?? (await Promise.all(candidates[target].map(async path => (await exists(path)) ? path : undefined))).find(Boolean);
  return { ...details, executablePath, iconPath: executablePath };
}

export const targets = Object.keys(targetDetails) as TerminalTarget[];

export function commandFor(target: TerminalTarget, executablePath: string, token: '%V' | '%1'): string {
  switch (target) {
    case 'terminal': return `wt.exe -d "${token}"`;
    case 'powershell': return `powershell.exe -NoExit -Command "Set-Location -LiteralPath '${token}'"`;
    case 'cmd': return `cmd.exe /K cd /d "${token}"`;
    case 'gitbash': return `"${executablePath}" --cd="${token}"`;
    case 'vscode': return `"${executablePath}" "${token}"`;
  }
}
