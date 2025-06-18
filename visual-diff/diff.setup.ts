import fs from 'node:fs/promises';
import path from 'node:path';

// Delete the dev and diff screenshots directories before running the tests.
await fs.rm(path.join('visual-diff', 'screenshots', 'dev'), { force: true, recursive: true });
await fs.rm(path.join('visual-diff', 'screenshots', 'diff'), { force: true, recursive: true });

// Ensure the diff screenshots directory exists.
await fs.mkdir(path.join('visual-diff', 'screenshots', 'diff'), { recursive: true });
