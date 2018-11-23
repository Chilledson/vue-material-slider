import hammer from 'hammerjs';

const SUPPORTED_HAMMER_GESTURES = [
  'longpress',
  'slide',
  'slidestart',
  'slideend',
  'slideright',
  'slideleft'
];

/**
 * Fake HammerInstance that is used when a Hammer instance is requested when HammerJS has not
 * been loaded on the page.
 */
const noopHammerInstance = {
  on: () => { },
  off: () => { },
};


class GestureConfig {
  /** List of new event names to add to the gesture support list */

  constructor(_hammerOptions) {
    this._hammerOptions = _hammerOptions;
    this.events = SUPPORTED_HAMMER_GESTURES;
    this.overrides = {};
    this.options = {};
  }

  /**
   * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
   * @param element Element to which to assign the new HammerJS gestures.
   * @returns Newly-created HammerJS instance.
   */
  buildHammer(element) {

    if (!hammer) {
      return noopHammerInstance;
    }

    const mc = new hammer(element, this._hammerOptions || undefined);

    // Default Hammer Recognizers.
    const pan = new hammer.Pan();
    const swipe = new hammer.Swipe();
    const press = new hammer.Press();

    // Notice that a HammerJS recognizer can only depend on one other recognizer once.
    // Otherwise the previous `recognizeWith` will be dropped.
    // TODO: Confirm threshold numbers with Material Design UX Team
    const slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
    const longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });

    // Overwrite the default `pan` event to use the swipe event.
    pan.recognizeWith(swipe);

    // Since the slide event threshold is set to zero, the slide recognizer can fire and
    // accidentally reset the longpress recognizer. In order to make sure that the two
    // recognizers can run simultaneously but don't affect each other, we allow the slide
    // recognizer to recognize while a longpress is being processed.
    // See: https://github.com/hammerjs/hammer.js/blob/master/src/manager.js#L123-L124
    longpress.recognizeWith(slide);

    // Add customized gestures to Hammer manager
    mc.add([swipe, press, pan, slide, longpress]);

    return mc;
  }

  /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
  _createRecognizer(base, options, ...inheritances) {
    let recognizer = new base.constructor(options);

    inheritances.push(base);
    inheritances.forEach(item => recognizer.recognizeWith(item));

    return recognizer;
  }

}

//

/** The thumb gap size for a disabled slider. */
const DISABLED_THUMB_GAP = 7;

/** The thumb gap size for a non-active slider at its minimum value. */
const MIN_VALUE_NONACTIVE_THUMB_GAP = 7;

/** The thumb gap size for an active slider at its minimum value. */
const MIN_VALUE_ACTIVE_THUMB_GAP = 10;

var script = {
  name: 'vue-material-slider',
  props: {
    value: [Number, String],
    min: [Number, String],
    max: [Number, String],
  },
  watch: {
    value (val) {
      this.val = Number(val);
    },
    min (val) {
      if (val) this.curMin = Number(val);
    },
    max (val) {
      if (val) this.curMax = Number(val);
    }
  },
  computed: {
    val: {
      get() {
        if (this.$data._value === null) {
          this.$data._value = this.$data._min;
        }
        return this.$data._value
		  },
      set(v) {
        if (v !== this.$data._value) {
          let value = v;
          // While incrementing by a decimal we can end up with values like 33.300000000000004.
          // Truncate it to ensure that it matches the label and to make it easier to work with.
          if (this.$data._roundToDecimal) {
            value = parseFloat(value.toFixed(this.$data._roundToDecimal));
          }

          this.$data._value = value;
          this.$data._percent = this._calculatePercentage(this.$data._value);
        }
      }
    },
    displayValue: {
      get () {
        if (this.displayWith) {
          return this.displayWith(this.val);
        }

        // Note that this could be improved further by rounding something like 0.999 to 1 or
        // 0.899 to 0.9, however it is very performance sensitive, because it gets called on
        // every change detection cycle.
        if (this._roundToDecimal && this.val && this.val % 1 !== 0) {
          return this.val.toFixed(this._roundToDecimal);
        }

        return this.val;
      }
    },
    curMin: {
      get() {
        return this.$data._min
		  },
      set(v) {
        this.$data._min = v;

        if (this.$data._value === null) {
          this.val = this.$data._min;
        }

        this.$data._percent = this._calculatePercentage(this.$data._value);
      }
    },
    curMax: {
      get() {
        return this.$data._max
		  },
      set(v = this.$data._max) {
        this.$data._max = v;
        this.$data._percent = this._calculatePercentage(this.$data._value);
      }
    },
    step: {
      get() {
        return this.$data._step
		  },
      set(v) {
        this.$data._step = v;

        if (this._step % 1 !== 0) {
          this.$data._roundToDecimal = this.$data._step.toString().split('.').pop().length;
        }
      }
    },
    _thumbContainerStyles: {
      get() {
        let axis = this.vertical ? 'Y' : 'X';
        
            // (this._getDirection() == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
        let offset = (1 - this.percent) * 100;
        return {
          'transform': `translate${axis}(-${offset}%)`
        }
      }
    },
    _trackBackgroundStyles: {
      get() {
        const axis = this.vertical ? 'Y' : 'X';
        const scale = this.vertical ? `1, ${1 - this.percent}, 1` : `${1 - this.percent}, 1, 1`;
        // const sign = this._shouldInvertMouseCoords() ? '-' : '';
        const sign = '';
        return {
          // scale3d avoids some rendering issues in Chrome. See #12071.
          transform: `translate${axis}(${sign}${this._thumbGap}px) scale3d(${scale})`
        }
      }
    },
    _trackFillStyles: {
      get() {
        const axis = this.vertical ? 'Y' : 'X';
        const scale = this.vertical ? `1, ${this.percent}, 1` : `${this.percent}, 1, 1`;
        // const sign = this._shouldInvertMouseCoords() ? '-' : '';
        const sign = '';
        return {
          // scale3d avoids some rendering issues in Chrome. See #12071.
          transform: `translate${axis}(${sign}${this._thumbGap}px) scale3d(${scale})`
        };
      }
    },
    _thumbGap: {
      get() {
        if (this.disabled) {
          return DISABLED_THUMB_GAP;
        }
        if (this._isMinValue && !this.thumbLabel) {
          return this._isActive ? MIN_VALUE_ACTIVE_THUMB_GAP : MIN_VALUE_NONACTIVE_THUMB_GAP;
        }
        return 0;
      }
    },
    percent: {
      get() {
        return this._clamp(this.$data._percent)
      }
    },
    _invertAxis: {
      get() {
        // Standard non-inverted mode for a vertical slider should be dragging the thumb from bottom to
        // top. However from a y-axis standpoint this is inverted.
        return this.vertical ? !this.invert : this.invert;
      }
    }
  },
  data () {
    return {
      disabled: false,
      mc: null,
      vertical: false,
      isSliding: false,
      _sliderDimensions: null,
      _min: 0,
      _max: 100,
      _value: null,
      _roundToDecimal: null,
      _step: 1,
      _percent: 0,
      _isActive: false
    }
  },
  mounted () {
    this.mc = new GestureConfig().buildHammer(this.$refs.slider);
    this.mc.on('slide', this._onSlide);
    this.mc.on('slideend', this._onSlideEnd);
    this.mc.on('slidestart', this._onSlideStart);

    // Set initial values
    this.val = this.value;
    if (this.min) this.curMin = this.min;
    if (this.max) this.curMax = this.max;

  },
  methods: {
    _onMouseenter() {
      if (this.disabled) {
        return;
      }

      // We save the dimensions of the slider here so we can use them to update the spacing of the
      // ticks and determine where on the slider click and slide events happen.
      this.$data._sliderDimensions = this._getSliderDimensions();
      // this.$data._updateTickIntervalPercent();
    },
    _onMousedown(event) {
      // Don't do anything if the slider is disabled or the
      // user is using anything other than the main mouse button.
      if (this.disabled || event.button !== 0) {
        return;
      }

      const oldValue = this.val;
      this._focusHostElement();
      this.isSliding = false;
      
      this._updateValueFromPosition({x: event.clientX, y: event.clientY});

      // Emit a change and input event if the value changed.
      if (oldValue != this.val) {
        this._emitInputEvent();
        this._emitChangeEvent();
      }
    },
    _onSlide(event) {
      
      if (this.disabled) {
        return;
      }

      if (!this.isSliding) {
        this._onSlideStart(null);
      }

      event.preventDefault();

      let oldValue = this.val;
      this._updateValueFromPosition({x: event.center.x, y: event.center.y});

      if (oldValue != this.val) {
        this._emitInputEvent();
        this._emitChangeEvent();
      }
    },
    _onSlideStart(event) {
      if (this.disabled || this.isSliding) {
        return;
      }

      // Simulate mouseenter in case this is a mobile device.
      this._onMouseenter();

      this.isSliding = true;
      this._focusHostElement();
      this.$data._valueOnSlideStart = this.val;

      if (event) {
        this._updateValueFromPosition({x: event.center.x, y: event.center.y});
        event.preventDefault();
      }
    },
    _onSlideEnd () {
      this.isSliding = false;

      if (this.$data._valueOnSlideStart != this.val && !this.disabled) {
        this._emitChangeEvent();
      }
      this.$data._valueOnSlideStart = null;
    },
    _updateValueFromPosition(pos) {
      if (!this.$data._sliderDimensions) {
        return;
      }

      let offset = this.vertical ? this.$data._sliderDimensions.top : this.$data._sliderDimensions.left;
      let size = this.vertical ? this.$data._sliderDimensions.height : this.$data._sliderDimensions.width;
      let posComponent = this.vertical ? pos.y : pos.x;

      // The exact value is calculated from the event and used to find the closest snap value.
      let percent = this._clamp((posComponent - offset) / size);

      // Since the steps may not divide cleanly into the max value, if the user
      // slide to 0 or 100 percent, we jump to the min/max value. This approach
      // is slightly more intuitive than using `Math.ceil` below, because it
      // follows the user's pointer closer.
      if (percent === 0) {
        this.val = this.curMin;
      } else if (percent === 1) {
        this.val = this.curMax;
      } else {
        const exactValue = this._calculateValue(percent);
        // This calculation finds the closest step by finding the closest
        // whole number divisible by the step relative to the min.
        const closestValue = Math.round((exactValue - this.curMin) / this.step) * this.step + this.curMin;
        // The value needs to snap to the min and max.
        this.val = this._clamp(closestValue, this.curMin, this.curMax);
      }
    },
    _getSliderDimensions() {
      return this.$refs.slider ? this.$refs.slider.getBoundingClientRect() : null;
    },
    _clamp(value, min = 0, max = 1) {
      return Math.max(min, Math.min(value, max));
    },
    _focusHostElement() {
      this.$refs.slider.focus();
    },
    _calculateValue(percentage) {
      return this.curMin + percentage * (this.curMax - this.curMin);
    },
    _calculatePercentage(value) {
      return ((value || 0) - this.curMin) / (this.curMax - this.curMin);
    },
    _emitInputEvent() {
      this.$emit('input', this.val);
    },
    _emitChangeEvent() {
      this.$emit('change', this.val);
    },
    _getDirection() {
      return (this.$data._dir && this.$data._dir == 'rtl') ? 'rtl' : 'ltr';
    },
    _shouldInvertMouseCoords() {
      return (this._getDirection() == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
    }
  }
};

/* script */
            const __vue_script__ = script;
            
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"slider",staticClass:"slider slider-horizontal",on:{"mousedown":_vm._onMousedown,"mouseenter":_vm._onMouseenter}},[_c('div',{staticClass:"slider-wrapper",class:{'slider-sliding': _vm.isSliding}},[_c('div',{staticClass:"slider-track-wrapper"},[_c('div',{staticClass:"slider-track-background",style:(_vm._trackBackgroundStyles)}),_vm._v(" "),_c('div',{staticClass:"slider-track-fill",style:(_vm._trackFillStyles)})]),_vm._v(" "),_vm._m(0),_vm._v(" "),_c('div',{staticClass:"slider-thumb-container",style:(_vm._thumbContainerStyles)},[_c('div',{staticClass:"slider-focus-ring"}),_vm._v(" "),_c('div',{staticClass:"slider-thumb"}),_vm._v(" "),_c('div',{staticClass:"slider-thumb-label"},[_c('span',{staticClass:"slider-thumb-label-text"},[_vm._v(_vm._s(_vm.displayValue))])])])])])};
var __vue_staticRenderFns__ = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"slider-ticks-container"},[_c('div',{staticClass:"slider-ticks"})])}];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "slider.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var slider = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

export default slider;
