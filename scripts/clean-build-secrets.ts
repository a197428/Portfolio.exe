import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';

const generatedSecrets = resolve('dist/portfolio_exe/.dev.vars');
await unlink(generatedSecrets).catch((error: NodeJS.ErrnoException) => {
  if (error.code !== 'ENOENT') throw error;
});
