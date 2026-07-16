import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import external from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import analyze from 'rollup-plugin-analyzer';
import dts from 'rollup-plugin-dts';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');

const makeExternal = (pkg) => {
  const externals = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'react/jsx-runtime',
    'react-dom/client'
  ];
  return id => {
    if (id.startsWith('.') || id.startsWith('/') || path.isAbsolute(id)) {
      return externals.some(dep => id.includes(`/node_modules/${dep}/`) || id.endsWith(`/node_modules/${dep}`));
    }
    return externals.some(dep => id === dep || id.startsWith(dep + '/'));
  };
};

const PRODUCTION = process.env.NODE_ENV === 'production';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        dir: 'dist/cjs',
        format: 'cjs',
        sourcemap: 'hidden',
        preserveModules: true,
        preserveModulesRoot: 'src',
        plugins: [PRODUCTION && terser()],
        exports: 'auto',
      },

      {
        dir: 'dist/esm',
        format: 'esm',
        sourcemap: 'hidden',
        preserveModules: true,
        preserveModulesRoot: 'src',
        plugins: [PRODUCTION && terser()],
      },
    ],
    external: makeExternal(packageJson),
    plugins: [
      replace(
        PRODUCTION
          ? {
              'process.env.NODE_ENV': JSON.stringify('production'),
              "process.env['NODE_ENV']": JSON.stringify('production'),
              'process.env["NODE_ENV"]': JSON.stringify('production'),
            }
          : {}
      ),
      resolve({
        browser: true,
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
      }),
      commonjs({ include: ['node_modules/**', '../../node_modules/**'] }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/preset-react'],
        babelHelpers: 'bundled',
      }),
      postcss(),
      json(),
      analyze({
        limit: 20,
        summaryOnly: true,
      }),
    ],
  },

  {
    input: 'src/index.js',
    output: {
      file: 'dist/esm/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
