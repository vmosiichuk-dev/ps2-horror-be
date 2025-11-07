# PS2 Survival Horror – Back-end

This project includes [`ps2-horror-shared`](https://github.com/vmosiichuk-dev/ps2-horror-shared) as a Git submodule, providing shared TypeScript types and utilities.

## Get started

Clone the repository including submodules:

```bash
git clone --recurse-submodules git@github.com:vmosiichuk-dev/ps2-horror-be.git
npm install
```

If you already cloned without submodules, initialize and update them:

```bash
git submodule update --init --recursive
npm install
```

## Submodule usage

It is designed for explicit imports only, to clearly distinguish type and function imports:

```ts
import type { GameItem } from 'ps2-horror-shared/types';
import { toCamelCase } from 'ps2-horror-shared/utils';
```