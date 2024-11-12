import { createLunaria } from '@lunariajs/core';
import { Page } from '../lunaria/components.ts';
import { writeFileSync, mkdirSync } from 'node:fs';

const lunaria = await createLunaria();
const status = await lunaria.getFullStatus();

const html = Page(lunaria.config, status, lunaria);

mkdirSync('dist/lunaria', { recursive: true });
writeFileSync('dist/lunaria/index.html', html);
