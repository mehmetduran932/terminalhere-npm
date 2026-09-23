# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a vulnerability

Do not open a public issue for a security vulnerability. Report it through a
[GitHub Private Security Advisory](https://github.com/mehmetduran932/terminalhere-npm/security/advisories/new)
or contact the repository maintainer privately. Include affected platforms,
reproduction details, and the potential impact.

The package must not write outside the current user's supported integration
locations: `HKCU\\Software\\Classes` on Windows, Finder Services on macOS, and
the user's Nautilus scripts directory on Linux. Administrator privileges are
never required.
