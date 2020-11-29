module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "1bd8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"65891a90-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/slider.vue?vue&type=template&id=15fea5b8&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"slider",staticClass:"slider",class:{
    'slider-disabled': _vm.disabled,
    'slider-vertical': _vm.vertical,
    'slider-sliding': _vm.isSliding,
    'slider-horizontal': !_vm.vertical,
    'slider-axis-inverted': _vm.invertAxis,
    'slider-focused': _vm.isActive,
    'slider-min-value': _vm.isMinValue,
    'slider-thumb-label-showing': _vm.thumbLabel,
  },attrs:{"tabindex":"0"},on:{"mouseenter":_vm.onMouseenter,"mousedown":_vm.onMousedown,"keydown":_vm.onKeydown,"focus":_vm.onFocus,"keyup":_vm.onKeyup,"blur":_vm.onBlur}},[_c('div',{staticClass:"slider-wrapper",class:{ 'slider-sliding': _vm.isSliding }},[_c('div',{staticClass:"slider-track-wrapper"},[_c('div',{staticClass:"slider-track-background",style:(_vm.trackBackgroundStyles)}),_c('div',{staticClass:"slider-track-fill",style:(_vm.trackFillStyles)})]),_vm._m(0),_c('div',{staticClass:"slider-thumb-container",style:(_vm.thumbContainerStyles)},[_c('div',{staticClass:"slider-focus-ring"}),_c('div',{staticClass:"slider-thumb"}),_c('div',{staticClass:"slider-thumb-label"},[_c('span',{staticClass:"slider-thumb-label-text"},[_vm._v(_vm._s(_vm.displayValue))])])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"slider-ticks-container"},[_c('div',{staticClass:"slider-ticks"})])}]


// CONCATENATED MODULE: ./src/components/slider.vue?vue&type=template&id=15fea5b8&

// CONCATENATED MODULE: ./src/keycodes.js
const PAGE_UP = 33;
const PAGE_DOWN = 34;
const END = 35;
const HOME = 36;
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/slider.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/** The thumb gap size for a disabled slider. */

const DISABLED_THUMB_GAP = 7;
/** The thumb gap size for a non-active slider at its minimum value. */

const MIN_VALUE_NONACTIVE_THUMB_GAP = 7;
/** The thumb gap size for an active slider at its minimum value. */

const MIN_VALUE_ACTIVE_THUMB_GAP = 10;
/** Returns the window element for the givent el. */

function getWindowForElement(element) {
  var doc = element.ownerDocument || element;
  return doc.defaultView || doc.parentWindow || window;
}

/* harmony default export */ var slidervue_type_script_lang_js_ = ({
  name: "vue-material-slider",
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    min: {
      type: [Number, String],
      default: 0
    },
    max: {
      type: [Number, String],
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    },
    invert: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
      default: 0
    },
    thumbLabel: {
      type: Boolean,
      default: false
    },
    dir: {
      type: String,
      validator: value => value.includes("rtl") || value.includes("ltr"),
      default: "ltr"
    },
    displayWith: {
      type: Function,
      default: null
    },
    stepSize: {
      type: [String, Number],
      default: 1
    }
  },
  watch: {
    value(val) {
      this.val = Number(val);
    },

    min(val) {
      if (val) {
        this.curMin = Number(val);
      }
    },

    max(val) {
      if (val) {
        this.curMax = Number(val);
      }
    }

  },
  computed: {
    val: {
      get() {
        if (this.localValue === null) {
          return this.min;
        }

        return this.localValue;
      },

      set(v) {
        if (v !== this.localValue) {
          let value = v; // While incrementing by a decimal we can end up with values like 33.300000000000004.
          // Truncate it to ensure that it matches the label and to make it easier to work with.

          if (this.roundToDecimal) {
            value = parseFloat(value.toFixed(this.roundToDecimal));
          }

          this.localValue = value;
          this.localPercent = this.calculatePercentage(this.localValue);
        }
      }

    },

    displayValue() {
      if (this.displayWith) {
        return this.displayWith(this.val);
      } // When incrementing using a decimal value make sure its rounded 


      if (this.roundToDecimal && this.val && this.val % 1 !== 0) {
        return this.val.toFixed(this.roundToDecimal);
      }

      return this.val;
    },

    curMin: {
      get() {
        return this.min;
      },

      set(v) {
        this.min = v;

        if (this.localValue === null) {
          this.val = this.min;
        }

        this.localPercent = this.calculatePercentage(this.localValue);
      }

    },
    curMax: {
      get() {
        return this.max;
      },

      set(v = this.max) {
        this.max = v;
        this.localPercent = this.calculatePercentage(this.localValue);
      }

    },
    step: {
      get() {
        return this.localStep;
      },

      set(v) {
        this.localStep = v;

        if (this.localStep % 1 !== 0) {
          this.roundToDecimal = this.localStep.toString().split(".").pop().length;
        }
      }

    },

    thumbContainerStyles() {
      let axis = this.vertical ? "Y" : "X"; // For a horizontal slider in RTL languages we push the thumb container off the left edge
      // instead of the right edge to avoid causing a horizontal scrollbar to appear.

      let invertOffset = this.getDirection() == "rtl" && !this.vertical ? !this.invertAxis : this.invertAxis;
      let offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
      return {
        transform: `translate${axis}(-${offset}%)`
      };
    },

    trackBackgroundStyles() {
      const axis = this.vertical ? "Y" : "X";
      const scale = this.vertical ? `1, ${1 - this.percent}, 1` : `${1 - this.percent}, 1, 1`;
      const sign = this.shouldInvertMouseCoords() ? "-" : "";
      return {
        // scale3d avoids some rendering issues in Chrome. See #12071.
        transform: `translate${axis}(${sign}${this.thumbGap}px) scale3d(${scale})`
      };
    },

    trackFillStyles() {
      const axis = this.vertical ? "Y" : "X";
      const scale = this.vertical ? `1, ${this.percent}, 1` : `${this.percent}, 1, 1`;
      const sign = this.shouldInvertMouseCoords() ? "" : "-";
      return {
        // scale3d avoids some rendering issues in Chrome. See #12071.
        transform: `translate${axis}(${sign}${this.thumbGap}px) scale3d(${scale})`
      };
    },

    thumbGap() {
      if (this.disabled) {
        return DISABLED_THUMB_GAP;
      }

      if (this.isMinValue && !this.thumbLabel) {
        return this.isActive ? MIN_VALUE_ACTIVE_THUMB_GAP : MIN_VALUE_NONACTIVE_THUMB_GAP;
      }

      return 0;
    },

    percent() {
      return this.clamp(this.localPercent);
    },

    invertAxis() {
      // Standard non-inverted mode for a vertical slider should be dragging the thumb from bottom to
      // top. However from a y-axis standpoint this is inverted.
      return this.vertical ? !this.invert : this.invert;
    },

    isMinValue() {
      return this.percent === 0;
    }

  },

  data() {
    return {
      isSliding: false,
      isActive: false,
      sliderDimensions: null,
      roundToDecimal: null,
      localStep: null,
      localPercent: 0,
      localValue: this.value,
      valueOnSlideStart: null
    };
  },

  mounted() {
    // Mousemove/mouseup are bound to the window so they area always recognised
    const el = this.$el;
    const win = getWindowForElement(this.$el);
    this.addEventListener(win, 'mousemove', this.onSlide);
    this.addEventListener(win, 'mouseup', this.onSlideEnd);
    this.addEventListener(el, 'touchstart', this.onSlideStart);
    this.addEventListener(el, 'touchmove', this.onSlide);
    this.addEventListener(el, 'touchend', this.onSlideEnd);
    this.addEventListener(el, 'touchcancel', this.onSlideEnd); // Set initial values

    this.val = this.localValue;
    this.step = this.stepSize;
    if (this.min) this.curMin = this.min;
    if (this.max) this.curMax = this.max;
  },

  methods: {
    onMouseenter() {
      if (this.disabled) {
        return;
      } // We save the dimensions of the slider here so we can use them to update the spacing of the
      // ticks and determine where on the slider click and slide events happen.


      this.sliderDimensions = this.getSliderDimensions();
    },

    onMousedown(event) {
      // Don't do anything if the slider is disabled or the
      // user is using anything other than the main mouse button.
      if (this.disabled || event.button !== 0) {
        return;
      }

      const oldValue = this.val;
      this.isSliding = false;
      this.focusHostElement();
      const {
        clientX: x,
        clientY: y
      } = event.touches && event.touches[0] || event;
      this.updateValueFromPosition({
        x,
        y
      }); // Emit a change and input event if the value changed.

      if (oldValue != this.val) {
        this.emitChangeEvent();
      }
    },

    onSlide(event) {
      if (this.disabled || !this.isActive) {
        return;
      }

      this.isSliding = true;
      event.preventDefault();
      const oldValue = this.val;
      const {
        clientX: x,
        clientY: y
      } = event.touches && event.touches[0] || event;
      this.updateValueFromPosition({
        x,
        y
      });

      if (oldValue != this.val) {
        this.emitChangeEvent();
      }
    },

    onSlideStart(event) {
      if (this.disabled || this.isSliding) {
        return;
      } // Simulate mouseenter in case this is a mobile device.


      this.onMouseenter();
      this.focusHostElement();
      this.valueOnSlideStart = this.val;

      if (event) {
        const {
          clientX: x,
          clientY: y
        } = event.touches && event.touches[0] || event;
        this.updateValueFromPosition({
          x,
          y
        });
        event.preventDefault();
      }
    },

    onSlideEnd() {
      this.isSliding = false;

      if (this.valueOnSlideStart != this.val && !this.disabled) {
        this.emitChangeEvent();
      }

      this.valueOnSlideStart = null;
      this.isActive = false;
    },

    onKeyup() {
      this.isSliding = false;
    },

    onFocus() {
      this.sliderDimensions = this.getSliderDimensions();
    },

    updateValueFromPosition(pos) {
      if (!this.sliderDimensions) {
        return;
      }

      let offset = this.vertical ? this.sliderDimensions.top : this.sliderDimensions.left;
      let size = this.vertical ? this.sliderDimensions.height : this.sliderDimensions.width;
      let posComponent = this.vertical ? pos.y : pos.x; // The exact value is calculated from the event and used to find the closest snap value.

      let percent = this.clamp((posComponent - offset) / size);

      if (this.shouldInvertMouseCoords()) {
        percent = 1 - percent;
      } // Since the steps may not divide cleanly into the max value, if the user
      // slide to 0 or 100 percent, we jump to the min/max value. This approach
      // is slightly more intuitive than using `Math.ceil` below, because it
      // follows the user's pointer closer.


      if (percent === 0) {
        this.val = this.curMin;
      } else if (percent === 1) {
        this.val = this.curMax;
      } else {
        const exactValue = this.calculateValue(percent); // This calculation finds the closest step by finding the closest
        // whole number divisible by the step relative to the min.

        const closestValue = Math.round((exactValue - this.curMin) / this.step) * this.step + this.curMin; // The value needs to snap to the min and max.

        this.val = this.clamp(closestValue, this.curMin, this.curMax);
      }
    },

    onKeydown(event) {
      if (this.disabled) {
        return;
      }

      let oldValue = this.val;

      switch (event.keyCode) {
        case PAGE_UP:
          this.increment(10);
          break;

        case PAGE_DOWN:
          this.increment(-10);
          break;

        case END:
          this.localValue = this.max;
          break;

        case HOME:
          this.localValue = this.min;
          break;

        case LEFT_ARROW:
          // NOTE: For a sighted user it would make more sense that when they press an arrow key on an
          // inverted slider the thumb moves in that direction. However for a blind user, nothing
          // about the slider indicates that it is inverted. They will expect left to be decrement,
          // regardless of how it appears on the screen. For speakers ofRTL languages, they probably
          // expect left to mean increment. Therefore we flip the meaning of the side arrow keys for
          // RTL. For inverted sliders we prefer a good a11y experience to having it "look right" for
          // sighted users, therefore we do not swap the meaning.
          this.increment(this.getDirection() == "rtl" ? 1 : -1);
          break;

        case UP_ARROW:
          this.increment(1);
          break;

        case RIGHT_ARROW:
          // See comment on LEFT_ARROW about the conditions under which we flip the meaning.
          this.increment(this.getDirection() == "rtl" ? -1 : 1);
          break;

        case DOWN_ARROW:
          this.increment(-1);
          break;

        default:
          // Return if the key is not one that we explicitly handle to avoid calling preventDefault on
          // it.
          return;
      }

      if (oldValue != this.localValue) {
        this.emitChangeEvent();
      }

      this.isSliding = true;
      event.preventDefault();
    },

    increment(numSteps) {
      this.val = this.clamp((this.val || 0) + this.step * numSteps, this.curMin, this.curMax);
    },

    getSliderDimensions() {
      return this.$refs.slider ? this.$refs.slider.getBoundingClientRect() : null;
    },

    clamp(value, min = 0, max = 1) {
      return Math.max(min, Math.min(value || 0, max));
    },

    onBlur() {
      this.isActive = false;
    },

    focusHostElement() {
      this.isActive = true;
      this.$refs.slider.focus();
    },

    calculateValue(percentage) {
      return this.curMin + percentage * (this.curMax - this.curMin);
    },

    calculatePercentage(value) {
      return ((value || 0) - this.curMin) / (this.curMax - this.curMin);
    },

    emitChangeEvent() {
      this.$emit("change", this.val);
    },

    getDirection() {
      return this.dir == "rtl" ? "rtl" : "ltr";
    },

    shouldInvertMouseCoords() {
      return this.getDirection() == "rtl" && !this.vertical ? !this.invertAxis : this.invertAxis;
    },

    addEventListener(el, event, handler) {
      el.addEventListener(event, handler.bind(this));
      this.$once('hook:beforeDestroy', () => {
        el.removeEventListener(event, handler);
      });
    }

  }
});
// CONCATENATED MODULE: ./src/components/slider.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_slidervue_type_script_lang_js_ = (slidervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/slider.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__("2519")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = normalizeComponent(
  components_slidervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  null
  ,true
)

/* harmony default export */ var slider = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ "2519":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_slider_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d4f7");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_slider_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_slider_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_slider_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_slider_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "c8ba":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "d4f7":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "install", function() { return /* reexport */ src_plugin["b" /* install */]; });

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./src/plugin.js
var src_plugin = __webpack_require__("fe83");

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_plugin["a" /* default */]);



/***/ }),

/***/ "fe83":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return install; });
/* harmony import */ var _components_slider_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1bd8");
 // Declare install function executed by Vue.use()

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('vue-material-slider', _components_slider_vue__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]);
} // Create module definition for Vue.use()

var plugin = {
  install: install
}; // Auto-install when vue is found (eg. in browser via <script> tag)

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

/* harmony default export */ __webpack_exports__["a"] = (_components_slider_vue__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("c8ba")))

/***/ })

/******/ })["default"];
//# sourceMappingURL=vue-material-slider.common.js.map