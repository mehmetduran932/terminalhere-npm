import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import type { RegistryClient } from './types.js';

const execFile = promisify(execFileCallback);
const HKCU = 'HKCU\\';

function registryPath(path: string): string {
  return `${HKCU}${path}`;
}

/** Windows Registry client using argument arrays: values are never shell-interpolated. */
export class RegExeClient implements RegistryClient {
  private async run(args: string[]): Promise<void> {
    await execFile('reg.exe', args, { windowsHide: true });
  }

  async keyExists(path: string): Promise<boolean> {
    try {
      await this.run(['QUERY', registryPath(path)]);
      return true;
    } catch {
      return false;
    }
  }

  async setDefaultValue(path: string, value: string): Promise<void> {
    await this.run(['ADD', registryPath(path), '/ve', '/t', 'REG_SZ', '/d', value, '/f']);
  }

  async setStringValue(path: string, name: string, value: string): Promise<void> {
    await this.run(['ADD', registryPath(path), '/v', name, '/t', 'REG_SZ', '/d', value, '/f']);
  }

  async deleteTree(path: string): Promise<void> {
    try {
      await this.run(['DELETE', registryPath(path), '/f']);
    } catch {
      // Deleting a missing key is idempotent.
    }
  }
}
