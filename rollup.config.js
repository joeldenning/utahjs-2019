import { terser } from 'rollup-plugin-terser'

export default {
  input: 'yoshi/yoshi-dom.js',
  output: {
    format: 'esm',
    file: 'dist/yoshi.min.js',
  },
  plugins: [
    terser()
  ]
}