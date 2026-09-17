import { createLunaria, generateDashboard } from '@lunariajs/core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SvgSummary } from './lunaria/summary.ts';

const lunaria = await createLunaria();
const status = await lunaria.getFullStatus();

const outDir = lunaria.config.outDir;
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), generateDashboard(lunaria.config, status));
writeFileSync(join(outDir, 'summary.svg'), SvgSummary(lunaria.config, status));
