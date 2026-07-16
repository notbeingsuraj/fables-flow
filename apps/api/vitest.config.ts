import { defineConfig } from 'vitest/config';

import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    root: '.',
    environment: 'node',
    include: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
  },
  plugins: [swc.vite()],
});
