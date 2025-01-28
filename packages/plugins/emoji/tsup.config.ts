import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  outDir: 'dist',
  external: ['react'],
  esbuildOptions(options) {
    options.assetNames = 'assets/[name]';
  },
  loader: {
    '.css': 'copy',
  },
});
