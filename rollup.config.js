import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import pluginTypeScript from '@babel/preset-typescript'

/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: 'src/previewProcessMain.ts',
  preserveEntrySignatures: 'strict',
  external: [
    '@lvce-editor/ipc',
    '@lvce-editor/json-rpc',
    '@lvce-editor/verror',
  ],
  treeshake: {
    propertyReadSideEffects: false,
  },
  output: {
    file: 'dist/dist/index.js',
    format: 'es',
    freeze: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [pluginTypeScript],
    }),
    nodeResolve(),
  ],
}

export default options
