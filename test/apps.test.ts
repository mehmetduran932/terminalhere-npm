import { describe, expect, it } from 'vitest';
import { commandFor } from '../src/apps.js';

describe('commandFor', () => {
  it('preserves Explorer folder-background token for Windows Terminal', () => {
    expect(commandFor('terminal', 'C:\\unused.exe', '%V')).toBe('wt.exe -d "%V"');
  });
  it('uses LiteralPath for PowerShell paths containing special characters', () => {
    expect(commandFor('powershell', 'C:\\unused.exe', '%1')).toContain("-LiteralPath '%1'");
  });
  it('quotes custom executable paths', () => {
    expect(commandFor('vscode', 'C:\\Program Files\\Code.exe', '%V')).toBe(
      '"C:\\Program Files\\Code.exe" "%V"',
    );
  });
});
