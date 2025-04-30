import { createLunaria } from '@lunariajs/core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { Page, SvgSummary } from './lunaria/components.ts';

const lunaria = await createLunaria();
const status = await lunaria.getFullStatus();

const html = Page(lunaria.config, status, lunaria);
const svg = SvgSummary(lunaria.config, status);

mkdirSync('dist/lunaria', { recursive: true });
writeFileSync('dist/lunaria/index.html', html);
writeFileSync('dist/lunaria/summary.svg', svg);
