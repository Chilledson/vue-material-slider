import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import minify from 'rollup-plugin-babel-minify';
import babel from 'rollup-plugin-babel';

console.log(process)

export default {
  input: 'src/plugin.js', // Path relative to package.json
  output: {
    name: 'VueMaterialSlider',
    exports: 'named',
  },
  plugins: [
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
    }),
    babel(),
    minify()
  ],
};