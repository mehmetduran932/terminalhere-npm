export type TerminalTarget = 'terminal' | 'powershell' | 'cmd' | 'gitbash' | 'vscode';

export interface AppInfo {
  target: TerminalTarget;
  displayName: string;
  registryKeyName: string;
  executablePath?: string;
  iconPath?: string;
}

export interface TerminalStatus extends AppInfo {
  installed: boolean;
  enabled: boolean;
}

export interface RegistryClient {
  keyExists(path: string): Promise<boolean>;
  setDefaultValue(path: string, value: string): Promise<void>;
  setStringValue(path: string, name: string, value: string): Promise<void>;
  deleteTree(path: string): Promise<void>;
}
