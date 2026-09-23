import { commandFor, detectApp, targets } from './apps.js';
import type { RegistryClient, TerminalStatus, TerminalTarget } from './types.js';

const backgroundPaths = [
  'Software\\Classes\\Directory\\Background\\shell',
  'Software\\Classes\\Drive\\Background\\shell',
];
const directoryPaths = ['Software\\Classes\\Directory\\shell', 'Software\\Classes\\Drive\\shell'];

export class ContextMenuService {
  constructor(private readonly registry: RegistryClient) {}

  async enable(target: TerminalTarget): Promise<TerminalStatus> {
    const app = await detectApp(target);
    if (!app.executablePath)
      throw new Error(`${app.displayName} could not be found on this computer.`);
    for (const parent of backgroundPaths) await this.writeEntry(parent, app, '%V');
    for (const parent of directoryPaths) await this.writeEntry(parent, app, '%1');
    return { ...app, installed: true, enabled: true };
  }

  async disable(target: TerminalTarget): Promise<TerminalStatus> {
    const app = await detectApp(target);
    for (const parent of [...backgroundPaths, ...directoryPaths])
      await this.registry.deleteTree(`${parent}\\${app.registryKeyName}`);
    return { ...app, installed: Boolean(app.executablePath), enabled: false };
  }

  async status(target: TerminalTarget): Promise<TerminalStatus> {
    const app = await detectApp(target);
    const enabled = await this.registry.keyExists(`${backgroundPaths[0]}\\${app.registryKeyName}`);
    return { ...app, installed: Boolean(app.executablePath), enabled };
  }

  async enableAll(): Promise<TerminalStatus[]> {
    const results: TerminalStatus[] = [];
    for (const target of targets) {
      try {
        results.push(await this.enable(target));
      } catch {
        results.push(await this.status(target));
      }
    }
    return results;
  }

  async disableAll(): Promise<TerminalStatus[]> {
    return Promise.all(targets.map((target) => this.disable(target)));
  }
  async allStatuses(): Promise<TerminalStatus[]> {
    return Promise.all(targets.map((target) => this.status(target)));
  }

  private async writeEntry(
    parent: string,
    app: Awaited<ReturnType<typeof detectApp>>,
    token: '%V' | '%1',
  ): Promise<void> {
    const path = `${parent}\\${app.registryKeyName}`;
    await this.registry.setDefaultValue(path, app.displayName);
    if (app.iconPath) await this.registry.setStringValue(path, 'Icon', app.iconPath);
    await this.registry.setDefaultValue(
      `${path}\\command`,
      commandFor(app.target, app.executablePath!, token),
    );
  }
}
