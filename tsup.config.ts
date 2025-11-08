import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'validators/index': 'src/validators/index.ts',
    'formatters/index': 'src/formatters/index.ts',
    'sii/index': 'src/sii/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
})
