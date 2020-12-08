import Slider from './components/slider.vue';
import RangeSlider from './components/RangeSlider.vue'

export {
  Slider,
  RangeSlider
}

// Declare install function executed by Vue.use()
function registerComponents(Vue) {
  Vue.component('vue-material-slider', Slider);
  Vue.component('vue-material-range-slider', RangeSlider);
}

// Create module definition for Vue.use()
const plugin = {
  install(Vue, options) {
    const defaultOptions = Object.assign({}, {
      registerComponents: true
    }, options);

    if (defaultOptions.registerComponents) {
      registerComponents(Vue);
    }
  },
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default plugin;