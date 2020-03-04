import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    external: ['react', 'tabbable'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.main.replace(/\.js$/, '.min.js'), format: 'cjs' },
      { file: pkg.module, format: 'es' },
      { file: pkg.module.replace(/\.js$/, '.min.js'), format: 'es' }
    ],
    plugins: [
      babel(),
      resolve(),
      commonjs(),
      terser({
        include: /\.min\.js$/
      })
    ]
  }
];
