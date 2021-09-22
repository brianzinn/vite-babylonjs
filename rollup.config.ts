import esbuild from 'rollup-plugin-esbuild'
import dts from "rollup-plugin-dts"

const input = 'src/export.ts'

const external = [
  '@babylonjs/core',
  'vue',
]

function createConfig(format, output, plugins = [], minify = false) {
  const tsPlugin = esbuild({
    sourceMap: true,
    minify,
    target: 'es2019',
  })

  return {
    input,
    external,
    output: {
      format,
      ...output,
      // exports: 'named',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      // vue(),
      tsPlugin,
    ],
  }
}

export default [
  //createConfig('es', { file: 'build/vite-babylonjs.module.cdn.js' }, [replace(cdnReplaces)]), // '@rollup/plugin-replace'
  //createConfig('es', { file: 'build/vite-babylonjs.module.cdn.min.js' }, [replace(cdnReplaces)], true),
  createConfig('es', { file: 'build/vite-babylonjs.module.js' }),
  createConfig('es', { file: 'build/vite-babylonjs.module.min.js' }, [], true),
  createConfig('cjs', { file: 'build/vite-babylonjs.js' }),
  {
    input: 'types/export.d.ts',
    external,
    plugins: [dts()],
    output: {
      format: 'es',
      file: 'build/vite-babylonjs.d.ts',
    },
  },
]