#!/usr/bin/env node
import { PlatformIntegration } from './platform.js';
import { targets } from './apps.js';
import type { TerminalStatus, TerminalTarget } from './types.js';

const commands = [
  'install',
  'uninstall',
  'status',
  'enable',
  'disable',
  'enable-all',
  'disable-all',
  'open',
] as const;

function usage(): string {
  return `TerminalHere\n\nUsage: terminalhere <${commands.join('|')}> [target] [--json]\nTargets: ${targets.join(', ')}`;
}
function isTarget(value: string | undefined): value is TerminalTarget {
  return Boolean(value && targets.includes(value as TerminalTarget));
}
function print(statuses: TerminalStatus[], json: boolean): void {
  if (json) console.log(JSON.stringify(statuses, null, 2));
  else
    for (const item of statuses)
      console.log(
        `${item.displayName}: ${item.installed ? 'Available' : 'Not found'} / ${item.enabled ? 'Enabled' : 'Disabled'}`,
      );
}

async function main(): Promise<void> {
  const [command, target, ...flags] = process.argv.slice(2);
  const json = flags.includes('--json') || target === '--json';
  if (!command || command === '--help' || command === '-h') {
    console.log(usage());
    return;
  }
  const service = new PlatformIntegration();
  if (command === 'install' || command === 'enable-all')
    return void print(await service.install(isTarget(target) ? target : 'terminal'), json);
  if (command === 'uninstall' || command === 'disable-all')
    return void print(await service.uninstall(isTarget(target) ? target : 'terminal'), json);
  if (command === 'status')
    return void print(await service.getStatus(isTarget(target) ? target : undefined), json);
  if (command === 'open') return service.open(target && target !== '--json' ? target : undefined);
  if ((command === 'enable' || command === 'disable') && isTarget(target)) {
    print(
      command === 'enable' ? await service.install(target) : await service.uninstall(target),
      json,
    );
    return;
  }
  throw new Error(usage());
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
