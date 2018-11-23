import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import css from 'rollup-plugin-css-only'
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

const plugins = [
  vue({
    css: false
  }),
  resolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  commonjs(),
  babel()
]

export default [
  {
    input: 'src/plugin.js', // Path relative to package.json
    output: {
      name: 'VueMaterialSlider',
      exports: 'named',
      format: 'iife',
      file: 'dist/vue-material-slider.min.js'
    },
    plugins: [
      css({
        minify: true
      }),
      ...plugins,
      uglify()
    ]
  },
  {
    input: 'src/slider.vue', // Path relative to package.json
    output: {
      name: 'VueMaterialSlider',
      exports: 'named',
      format: 'esm',
      file: 'dist/vue-material-slider.esm.js'
    },
    plugins: [
      vue(),
    ]
  },
  {
    input: 'src/plugin.js',
    output: {
      name: 'VueMaterialSlider',
      exports: 'named',
      format: 'umd',
      file: 'dist/vue-virtual-slider.umd.js',
    },
    plugins: [
      ...plugins
    ]
  }
];