<template>
  <div class="mat-slider mat-slider-horizontal"
    @mousedown="_onMousedown"
    @mouseenter="_onMouseenter"
    ref="slider"
  >
    <div 
      class="mat-slider-wrapper"
      v-bind:class="{'mat-slider-sliding': isSliding}"
    >
      <div class="mat-slider-track-wrapper">
        <div class="mat-slider-track-background" v-bind:style="_trackBackgroundStyles"></div>
        <div class="mat-slider-track-fill" v-bind:style="_trackFillStyles"></div>
      </div>
      <div class="mat-slider-ticks-container">
        <div class="mat-slider-ticks"></div>
      </div>
      <div class="mat-slider-thumb-container" v-bind:style="_thumbContainerStyles">
        <div class="mat-slider-focus-ring"></div>
        <div class="mat-slider-thumb"></div>
        <div class="mat-slider-thumb-label">
          <span class="mat-slider-thumb-label-text">{{displayValue}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { GestureConfig } from './custom-gesture'

/** The thumb gap size for a disabled slider. */
const DISABLED_THUMB_GAP = 7;

/** The thumb gap size for a non-active slider at its minimum value. */
const MIN_VALUE_NONACTIVE_THUMB_GAP = 7;

/** The thumb gap size for an active slider at its minimum value. */
const MIN_VALUE_ACTIVE_THUMB_GAP = 10;

export default {
  name: 'vue-material-slider',
  props: {
    value: [Number, String],
    min: [Number, String],
    max: [Number, String],
  },
  watch: {
    value (val) {
      this.val = Number(val)
    },
    min (val) {
      if (val) this.curMin = Number(val)
    },
    max (val) {
      if (val) this.curMax = Number(val)
    }
  },
  computed: {
    val: {
      get() {
        if (this.$data._value === null) {
          this.$data._value = this.$data._min
        }
        return this.$data._value
		  },
      set(v) {
        if (v !== this.$data._value) {
          let value = v
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
        this.$data._min = v

        if (this.$data._value === null) {
          this.val = this.$data._min
        }

        this.$data._percent = this._calculatePercentage(this.$data._value)
      }
    },
    curMax: {
      get() {
        return this.$data._max
		  },
      set(v = this.$data._max) {
        this.$data._max = v
        this.$data._percent = this._calculatePercentage(this.$data._value);
      }
    },
    step: {
      get() {
        return this.$data._step
		  },
      set(v) {
        this.$data._step = v

        if (this._step % 1 !== 0) {
          this.$data._roundToDecimal = this.$data._step.toString().split('.').pop().length;
        }
      }
    },
    _thumbContainerStyles: {
      get() {
        let axis = this.vertical ? 'Y' : 'X';
        // For a horizontal slider in RTL languages we push the thumb container off the left edge
        // instead of the right edge to avoid causing a horizontal scrollbar to appear.
        let invertOffset = false
        
            // (this._getDirection() == 'rtl' && !this.vertical) ? !this._invertAxis : this._invertAxis;
        let offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
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
        const sign = ''
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
        const sign = ''
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
    this.mc = new GestureConfig().buildHammer(this.$refs.slider)
    this.mc.on('slide', this._onSlide)
    this.mc.on('slideend', this._onSlideEnd)
    this.mc.on('slidestart', this._onSlideStart)

    // Set initial values
    this.val = this.value
    if (this.min) this.curMin = this.min
    if (this.max) this.curMax = this.max

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
      this._focusHostElement()
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
        const closestValue = Math.round((exactValue - this.curMin) / this.step) * this.step + this.curMin
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
}

</script>

<style scoped>
h1, h2 {
  font-family: Lato;
}
.mat-slider {
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  padding: 8px;
  outline: 0;
  vertical-align: middle
}

.mat-slider-wrapper {
  position: absolute
}

.mat-slider {
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  padding: 8px;
  outline: 0;
  vertical-align: middle;
}

.mat-slider-track-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden
}

.mat-slider-track-fill {
  position: absolute;
  transform-origin: 0 0;
  transition: transform .4s cubic-bezier(.25, .8, .25, 1), background-color .4s cubic-bezier(.25, .8, .25, 1)
}

.mat-slider-track-background {
  position: absolute;
  transform-origin: 100% 100%;
  transition: transform .4s cubic-bezier(.25, .8, .25, 1), background-color .4s cubic-bezier(.25, .8, .25, 1)
}

.mat-slider-ticks-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden
}

.mat-slider-ticks {
  background-repeat: repeat;
  background-clip: content-box;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity .4s cubic-bezier(.25, .8, .25, 1)
}

.mat-slider-thumb-container {
  position: absolute;
  z-index: 1;
  transition: transform .4s cubic-bezier(.25, .8, .25, 1)
}

.mat-slider-focus-ring {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transform: scale(0);
  opacity: 0;
  transition: transform .4s cubic-bezier(.25, .8, .25, 1), background-color .4s cubic-bezier(.25, .8, .25, 1), opacity .4s cubic-bezier(.25, .8, .25, 1)
}

.cdk-keyboard-focused .mat-slider-focus-ring,
.cdk-program-focused .mat-slider-focus-ring {
  transform: scale(1);
  opacity: 1
}

.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb,
.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb-label {
  cursor: -webkit-grab;
  cursor: grab
}

.mat-slider-sliding:not(.mat-slider-disabled) .mat-slider-thumb,
.mat-slider-sliding:not(.mat-slider-disabled) .mat-slider-thumb-label,
.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb-label:active,
.mat-slider:not(.mat-slider-disabled) .mat-slider-thumb:active {
  cursor: -webkit-grabbing;
  cursor: grabbing
}

.mat-slider-thumb {
  position: absolute;
  right: -10px;
  bottom: -10px;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 3px solid transparent;
  border-radius: 50%;
  transform: scale(.7);
  transition: transform .4s cubic-bezier(.25, .8, .25, 1), background-color .4s cubic-bezier(.25, .8, .25, 1), border-color .4s cubic-bezier(.25, .8, .25, 1)
}

.mat-slider-thumb-label {
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: transform .4s cubic-bezier(.25, .8, .25, 1), border-radius .4s cubic-bezier(.25, .8, .25, 1), background-color .4s cubic-bezier(.25, .8, .25, 1)
}

/* @media screen and (-ms-high-contrast:active) {
  .mat-slider-thumb-label {
      outline: solid 1px
  }
} */

.mat-slider-thumb-label-text {
  z-index: 1;
  opacity: 0;
  transition: opacity .4s cubic-bezier(.25, .8, .25, 1)
}

.mat-slider-sliding .mat-slider-thumb-container,
.mat-slider-sliding .mat-slider-track-background,
.mat-slider-sliding .mat-slider-track-fill {
  transition-duration: 0s
}

.mat-slider-has-ticks .mat-slider-wrapper::after {
  content: '';
  position: absolute;
  border-width: 0;
  border-style: solid;
  opacity: 0;
  transition: opacity .4s cubic-bezier(.25, .8, .25, 1)
}

.mat-slider-has-ticks.cdk-focused:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after,
.mat-slider-has-ticks:hover:not(.mat-slider-hide-last-tick) .mat-slider-wrapper::after {
  opacity: 1
}

.mat-slider-has-ticks.cdk-focused:not(.mat-slider-disabled) .mat-slider-ticks,
.mat-slider-has-ticks:hover:not(.mat-slider-disabled) .mat-slider-ticks {
  opacity: 1
}

.mat-slider-thumb-label-showing .mat-slider-focus-ring {
  transform: scale(0);
  opacity: 0
}

.mat-slider-thumb-label-showing .mat-slider-thumb-label {
  display: flex
}

.mat-slider-axis-inverted .mat-slider-track-fill {
  transform-origin: 100% 100%
}

.mat-slider-axis-inverted .mat-slider-track-background {
  transform-origin: 0 0
}

.mat-slider:not(.mat-slider-disabled).cdk-focused.mat-slider-thumb-label-showing .mat-slider-thumb {
  transform: scale(0)
}

.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label {
  border-radius: 50% 50% 0
}

.mat-slider:not(.mat-slider-disabled).cdk-focused .mat-slider-thumb-label-text {
  opacity: 1
}

.mat-slider:not(.mat-slider-disabled).cdk-mouse-focused .mat-slider-thumb,
.mat-slider:not(.mat-slider-disabled).cdk-program-focused .mat-slider-thumb,
.mat-slider:not(.mat-slider-disabled).cdk-touch-focused .mat-slider-thumb {
  border-width: 2px;
  transform: scale(1)
}

.mat-slider-disabled .mat-slider-focus-ring {
  transform: scale(0);
  opacity: 0
}

.mat-slider-disabled .mat-slider-thumb {
  border-width: 4px;
  transform: scale(.5)
}

.mat-slider-disabled .mat-slider-thumb-label {
  display: none
}

.mat-slider-horizontal {
  height: 48px;
  min-width: 128px
}

.mat-slider-horizontal .mat-slider-wrapper {
  height: 2px;
  top: 23px;
  left: 8px;
  right: 8px
}

.mat-slider-horizontal .mat-slider-wrapper::after {
  height: 2px;
  border-left-width: 2px;
  right: 0;
  top: 0
}

.mat-slider-horizontal .mat-slider-track-wrapper {
  height: 2px;
  width: 100%
}

.mat-slider-horizontal .mat-slider-track-fill {
  height: 2px;
  width: 100%;
  transform: scaleX(0)
}

.mat-slider-horizontal .mat-slider-track-background {
  height: 2px;
  width: 100%;
  transform: scaleX(1)
}

.mat-slider-horizontal .mat-slider-ticks-container {
  height: 2px;
  width: 100%
}

@media screen and (-ms-high-contrast:active) {
  .mat-slider-horizontal .mat-slider-ticks-container {
      height: 0;
      outline: solid 2px;
      top: 1px
  }
}

.mat-slider-horizontal .mat-slider-ticks {
  height: 2px;
  width: 100%
}

.mat-slider-horizontal .mat-slider-thumb-container {
  width: 100%;
  height: 0;
  top: 50%
}

.mat-slider-horizontal .mat-slider-focus-ring {
  top: -15px;
  right: -15px
}

.mat-slider-horizontal .mat-slider-thumb-label {
  right: -14px;
  top: -40px;
  transform: translateY(26px) scale(.01) rotate(45deg)
}

.mat-slider-horizontal .mat-slider-thumb-label-text {
  transform: rotate(-45deg)
}

.mat-slider-horizontal.cdk-focused .mat-slider-thumb-label {
  transform: rotate(45deg)
}

@media screen and (-ms-high-contrast:active) {
  .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label,
  .mat-slider-horizontal.cdk-focused .mat-slider-thumb-label-text {
      transform: none
  }
}

.mat-slider-vertical {
  width: 48px;
  min-height: 128px
}

.mat-slider-vertical .mat-slider-wrapper {
  width: 2px;
  top: 8px;
  bottom: 8px;
  left: 23px
}

.mat-slider-vertical .mat-slider-wrapper::after {
  width: 2px;
  border-top-width: 2px;
  bottom: 0;
  left: 0
}

.mat-slider-vertical .mat-slider-track-wrapper {
  height: 100%;
  width: 2px
}

.mat-slider-vertical .mat-slider-track-fill {
  height: 100%;
  width: 2px;
  transform: scaleY(0)
}

.mat-slider-vertical .mat-slider-track-background {
  height: 100%;
  width: 2px;
  transform: scaleY(1)
}

.mat-slider-vertical .mat-slider-ticks-container {
  width: 2px;
  height: 100%
}

@media screen and (-ms-high-contrast:active) {
  .mat-slider-vertical .mat-slider-ticks-container {
      width: 0;
      outline: solid 2px;
      left: 1px
  }
}

.mat-slider-vertical .mat-slider-focus-ring {
  bottom: -15px;
  left: -15px
}

.mat-slider-vertical .mat-slider-ticks {
  width: 2px;
  height: 100%
}

.mat-slider-vertical .mat-slider-thumb-container {
  height: 100%;
  width: 0;
  left: 50%
}

.mat-slider-vertical .mat-slider-thumb {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden
}

.mat-slider-vertical .mat-slider-thumb-label {
  bottom: -14px;
  left: -40px;
  transform: translateX(26px) scale(.01) rotate(-45deg)
}

.mat-slider-vertical .mat-slider-thumb-label-text {
  transform: rotate(45deg)
}

.mat-slider-vertical.cdk-focused .mat-slider-thumb-label {
  transform: rotate(-45deg)
}

[dir=rtl] .mat-slider-wrapper::after {
  left: 0;
  right: auto
}

[dir=rtl] .mat-slider-horizontal .mat-slider-track-fill {
  transform-origin: 100% 100%
}

[dir=rtl] .mat-slider-horizontal .mat-slider-track-background {
  transform-origin: 0 0
}

[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-fill {
  transform-origin: 0 0
}

[dir=rtl] .mat-slider-horizontal.mat-slider-axis-inverted .mat-slider-track-background {
  transform-origin: 100% 100%
}

.mat-slider._mat-animation-noopable .mat-slider-focus-ring,
.mat-slider._mat-animation-noopable .mat-slider-has-ticks .mat-slider-wrapper::after,
.mat-slider._mat-animation-noopable .mat-slider-thumb,
.mat-slider._mat-animation-noopable .mat-slider-thumb-container,
.mat-slider._mat-animation-noopable .mat-slider-thumb-label,
.mat-slider._mat-animation-noopable .mat-slider-thumb-label-text,
.mat-slider._mat-animation-noopable .mat-slider-ticks,
.mat-slider._mat-animation-noopable .mat-slider-track-background,
.mat-slider._mat-animation-noopable .mat-slider-track-fill {
    transition: none
}

.mat-slider-track-fill,
.mat-slider-thumb,
.mat-slider-thumb-label {
  background-color: #ffd740; }

.mat-slider-thumb-label-text {
  color: rgba(0, 0, 0, 0.87); }

.mat-slider-track-background {
  background-color: rgba(0, 0, 0, 0.25);
}

.mat-slider-horizontal {
  height: 48px;
  min-width: 128px;
}

.mat-slider {
  min-width: 100%;
}
</style>
