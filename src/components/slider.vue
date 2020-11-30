<template>
  <div
    class="slider"
    :class="{
      'slider-disabled': disabled,
      'slider-vertical': vertical,
      'slider-sliding': isSliding,
      'slider-horizontal': !vertical,
      'slider-axis-inverted': invertAxis,
      'slider-focused': isActive,
      'slider-min-value': isMinValue,
      'slider-thumb-label-showing': thumbLabel,
    }"
    @mouseenter="onMouseenter"
    @mousedown="onMousedown"
    @keydown="onKeydown"
    @focus="onFocus"
    @keyup="onKeyup"
    @blur="onBlur"
    ref="slider"
    tabindex="0"
  >
    <div class="slider-wrapper" :class="{ 'slider-sliding': isSliding }">
      <div class="slider-track-wrapper">
        <div
          class="slider-track-background"
          :style="trackBackgroundStyles"
        ></div>
        <div class="slider-track-fill" :style="trackFillStyles"></div>
      </div>
      <div class="slider-ticks-container">
        <div class="slider-ticks"></div>
      </div>
      <div class="slider-thumb-container" :style="thumbContainerStyles">
        <div class="slider-focus-ring"></div>
        <div class="slider-thumb"></div>
        <div class="slider-thumb-label">
          <span class="slider-thumb-label-text">{{ displayValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from "../keycodes";

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

export default {
  name: "vue-material-slider",
  props: {
    value: {
      type: [Number, String, Array],
      default: 0,
    },
    min: {
      type: [Number, String],
      default: 0,
    },
    max: {
      type: [Number, String],
      default: 100,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    invert: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    thumbLabel: {
      type: Boolean,
      default: false,
    },
    dir: {
      type: String,
      validator: (value) => value.includes("rtl") || value.includes("ltr"),
      default: "ltr",
    },
    displayWith: {
      type: Function,
      default: null,
    },
    stepSize: {
      type: [String, Number],
      default: 1,
    },
  },
  watch: {
    value(val) {
      this.setLocalValue(val);
    },
    stepSize(val) {
      this.localStep = val;
    },
  },
  computed: {
    displayValue() {
      if (this.displayWith) {
        return this.displayWith(this.localValue);
      }

      // When incrementing using a decimal value make sure its rounded
      if (this.roundToDecimal && this.localValue && this.localValue % 1 !== 0) {
        return this.localValue.toFixed(this.roundToDecimal);
      }

      return this.localValue;
    },
    step: {
      get() {
        return this.localStep;
      },
      set(v) {
        this.localStep = v;

        if (this.localStep % 1 !== 0) {
          this.roundToDecimal = this.localStep
            .toString()
            .split(".")
            .pop().length;
        }
      },
    },
    thumbContainerStyles() {
      let axis = this.vertical ? "Y" : "X";
      // For a horizontal slider in RTL languages we push the thumb container off the left edge
      // instead of the right edge to avoid causing a horizontal scrollbar to appear.
      let invertOffset =
        this.getDirection() == "rtl" && !this.vertical
          ? !this.invertAxis
          : this.invertAxis;
      let offset = (invertOffset ? this.percent : 1 - this.percent) * 100;

      return {
        transform: `translate${axis}(-${offset}%)`,
      };
    },
    trackBackgroundStyles() {
      const axis = this.vertical ? "Y" : "X";
      const scale = this.vertical
        ? `1, ${1 - this.percent}, 1`
        : `${1 - this.percent}, 1, 1`;
      const sign = this.shouldInvertMouseCoords() ? "-" : "";

      return {
        // scale3d avoids some rendering issues in Chrome. See #12071.
        transform: `translate${axis}(${sign}${this.thumbGap}px) scale3d(${scale})`,
      };
    },
    trackFillStyles() {
      const axis = this.vertical ? "Y" : "X";

      const scale = this.vertical
        ? `1, ${this.percent}, 1`
        : `${this.percent}, 1, 1`;
      const sign = this.shouldInvertMouseCoords() ? "" : "-";

      return {
        // scale3d avoids some rendering issues in Chrome. See #12071.
        transform: `translate${axis}(${sign}${this.thumbGap}px) scale3d(${scale})`,
      };
    },
    thumbGap() {
      if (this.disabled) {
        return DISABLED_THUMB_GAP;
      }
      if (this.isMinValue && !this.thumbLabel) {
        return this.isActive
          ? MIN_VALUE_ACTIVE_THUMB_GAP
          : MIN_VALUE_NONACTIVE_THUMB_GAP;
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
    },
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
      valueOnSlideStart: null,
      activeThumb: 0,
    };
  },
  mounted() {
    // Mousemove/mouseup are bound to the window so they area always recognised
    const el = this.$el;
    const win = getWindowForElement(this.$el);

    this.addEventListener(win, "mousemove", this.onSlide);
    this.addEventListener(win, "mouseup", this.onSlideEnd);
    this.addEventListener(el, "touchstart", this.onSlideStart);
    this.addEventListener(el, "touchmove", this.onSlide);
    this.addEventListener(el, "touchend", this.onSlideEnd);
    this.addEventListener(el, "touchcancel", this.onSlideEnd);

    // Set initial values
    this.step = this.stepSize;
  },
  methods: {
    onMouseenter() {
      if (this.disabled) {
        return;
      }

      // We save the dimensions of the slider here so we can use them to update the spacing of the
      // ticks and determine where on the slider click and slide events happen.
      this.sliderDimensions = this.getSliderDimensions();
    },
    onMousedown(event) {
      // Don't do anything if the slider is disabled or the
      // user is using anything other than the main mouse button.
      if (this.disabled || event.button !== 0) {
        return;
      }

      const oldValue = this.localValue;

      this.isSliding = false;
      this.focusHostElement();

      const position = this.getTouchPoint(event);
      this.updateValueFromPosition(position);
      // Emit a change and input event if the value changed.
      if (oldValue != this.localValue) {
        this.emitChangeEvent();
      }
    },
    onSlide(event) {
      if (this.disabled || !this.isActive) {
        return;
      }

      this.isSliding = true;

      event.preventDefault();

      const oldValue = this.localValue;
      const position = this.getTouchPoint(event);
      this.updateValueFromPosition(position);

      if (oldValue != this.localValue) {
        this.emitChangeEvent();
      }
    },
    onSlideStart(event) {
      if (this.disabled || this.isSliding) {
        return;
      }

      // Simulate mouseenter in case this is a mobile device.
      this.onMouseenter();
      this.focusHostElement();

      this.localValueueOnSlideStart = this.localValue;

      if (event) {
        const position = this.getTouchPoint(event);
        this.updateValueFromPosition(position);
        event.preventDefault();
      }
    },
    onSlideEnd() {
      this.isSliding = false;

      if (this.localValueueOnSlideStart != this.localValue && !this.disabled) {
        this.emitChangeEvent();
      }
      this.localValueueOnSlideStart = null;
      this.isActive = false;
    },
    onKeyup() {
      this.isSliding = false;
    },
    onFocus() {
      this.sliderDimensions = this.getSliderDimensions();
    },
    onBlur() {
      this.isActive = false;
    },
    updateValueFromPosition({ x, y }) {
      if (!this.sliderDimensions) {
        return;
      }

      let offset = this.vertical
        ? this.sliderDimensions.top
        : this.sliderDimensions.left;
      let size = this.vertical
        ? this.sliderDimensions.height
        : this.sliderDimensions.width;
      let position = this.vertical ? y : x;

      // The exact value is calculated from the event and used to find the closest snap value.
      let percent = this.clamp((position - offset) / size);

      if (this.shouldInvertMouseCoords()) {
        percent = 1 - percent;
      }

      const exactValue = this.calculateValue(percent);
      // This calculation finds the closest step by finding the closest
      // whole number divisible by the step relative to the min.
      const closestValue =
        Math.round((exactValue - this.min) / this.step) * this.step + this.min;
      // The value needs to snap to the min and max.
      let value = this.clamp(closestValue, this.min, this.max);

      // When using multiple thumbs find the closest
      this.activeThumb = this.getClosestThumb(this.localValue, value);

      // Since the steps may not divide cleanly into the max value, if the user
      // slide to 0 or 100 percent, we jump to the min/max value. This approach
      // is slightly more intuitive than using `Math.ceil` below, because it
      // follows the user's pointer closer.
      if (percent === 0) {
        value = this.min;
      } else if (percent === 1) {
        value = this.max;
      }

      this.setLocalValue(value);
    },
    onKeydown(event) {
      if (this.disabled) {
        return;
      }

      let oldValue = this.localValue;

      switch (event.keyCode) {
        case PAGE_UP:
          this.increment(10);
          break;
        case PAGE_DOWN:
          this.increment(-10);
          break;
        case END:
          this.setLocalValue(this.max);
          break;
        case HOME:
          this.setLocalValue(this.min);
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
      let value = this.clamp(
        (this.localValue || 0) + this.step * numSteps,
        this.min,
        this.max
      );

      this.setLocalValue(value);
    },
    getSliderDimensions() {
      return this.$refs.slider
        ? this.$refs.slider.getBoundingClientRect()
        : null;
    },
    clamp(value, min = 0, max = 1) {
      return Math.max(min, Math.min(value || 0, max));
    },
    focusHostElement() {
      this.isActive = true;
      this.$refs.slider.focus();
    },
    calculateValue(percentage) {
      return this.min + percentage * (this.max - this.min);
    },
    calculatePercentage(value) {
      return ((value || 0) - this.min) / (this.max - this.min);
    },
    emitChangeEvent() {
      this.$emit("change", this.localValue);
    },
    getDirection() {
      return this.dir == "rtl" ? "rtl" : "ltr";
    },
    shouldInvertMouseCoords() {
      return this.getDirection() == "rtl" && !this.vertical
        ? !this.invertAxis
        : this.invertAxis;
    },
    addEventListener(el, event, handler) {
      el.addEventListener(event, handler.bind(this));
      this.$once("hook:beforeDestroy", () => {
        el.removeEventListener(event, handler);
      });
    },
    getTouchPoint(event) {
      const { clientX, clientY } = (event.touches && event.touches[0]) || event;
      return { x: clientX, y: clientY };
    },
    getClosestThumb(array, value) {
      if (Math.abs(array[0] - value) < Math.abs(array[1] - value)) {
        return 0;
      } else {
        return 1;
      }
    },
    setActiveThumb(index) {
      this.activeThumb = index;
    },
    setLocalValue(v) {
      if (v !== this.localValue) {
        let value = v;
        // While incrementing by a decimal we can end up with values like 33.300000000000004.
        // Truncate it to ensure that it matches the label and to make it easier to work with.
        if (this.roundToDecimal) {
          value = parseFloat(value.toFixed(this.roundToDecimal));
        }

        this.localValue = value;
        this.localPercent = this.calculatePercentage(this.localValue);
      }
    },
  },
};
</script>

<style lang="scss">
.slider {
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  padding: 8px;
  outline: 0;
  vertical-align: middle;
}

.slider-wrapper {
  position: absolute;
}

.slider-track-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  .slider-track-fill {
    position: absolute;
    transform-origin: 0 0;
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
      background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .slider-track-background {
    position: absolute;
    transform-origin: 100% 100%;
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
      background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}

.slider-ticks-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  .slider-ticks {
    background-repeat: repeat;
    background-clip: content-box;
    box-sizing: border-box;
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}

.slider-thumb-container {
  position: absolute;
  z-index: 1;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  .slider-focus-ring {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    transform: scale(0);
    opacity: 0;
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
      background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
      opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}

.slider:not(.slider-disabled) .slider-thumb,
.slider:not(.slider-disabled) .slider-thumb-label {
  cursor: -webkit-grab;
  cursor: grab;
}

.slider-sliding:not(.slider-disabled) .slider-thumb,
.slider-sliding:not(.slider-disabled) .slider-thumb-label,
.slider:not(.slider-disabled) .slider-thumb-label:active,
.slider:not(.slider-disabled) .slider-thumb:active {
  cursor: -webkit-grabbing;
  cursor: grabbing;
}

.slider-thumb {
  position: absolute;
  right: -10px;
  bottom: -10px;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 3px solid transparent;
  border-radius: 50%;
  transform: scale(0.7);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    border-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slider-thumb-label {
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    border-radius 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slider-thumb-label-text {
  z-index: 1;
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slider-sliding {
  .slider-thumb-container,
  .slider-track-background,
  .slider-track-fill {
    transition-duration: 0s;
  }
}

.slider-has-ticks .slider-wrapper::after {
  content: "";
  position: absolute;
  border-width: 0;
  border-style: solid;
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slider-has-ticks:focus:not(.slider-hide-last-tick) .slider-wrapper::after,
.slider-has-ticks:hover:not(.slider-hide-last-tick) .slider-wrapper::after {
  opacity: 1;
}

.slider-has-ticks:focus:not(.slider-disabled) .slider-ticks,
.slider-has-ticks:hover:not(.slider-disabled) .slider-ticks {
  opacity: 1;
}

.slider-thumb-label-showing .slider-focus-ring {
  transform: scale(0);
  opacity: 0;
}

.slider-thumb-label-showing .slider-thumb-label {
  display: flex;
}

.slider-axis-inverted .slider-track-fill {
  transform-origin: 100% 100%;
}

.slider-axis-inverted .slider-track-background {
  transform-origin: 0 0;
}

.slider:not(.slider-disabled):focus.slider-thumb-label-showing .slider-thumb {
  transform: scale(0);
}

.slider:not(.slider-disabled):focus .slider-thumb-label {
  border-radius: 50% 50% 0;
}

.slider:not(.slider-disabled):focus .slider-thumb-label-text {
  opacity: 1;
}

.slider:not(.slider-disabled).cdk-mouse-focused .slider-thumb,
.slider:not(.slider-disabled).cdk-program-focused .slider-thumb,
.slider:not(.slider-disabled).cdk-touch-focused .slider-thumb {
  border-width: 2px;
  transform: scale(1);
}

.slider-disabled .slider-focus-ring {
  transform: scale(0);
  opacity: 0;
}

.slider-disabled .slider-thumb {
  border-width: 4px;
  transform: scale(0.5);
}

.slider-disabled .slider-thumb,
.slider-disabled .slider-track-background,
.slider-disabled .slider-track-fill,
.slider-disabled:hover .slider-track-background {
  background-color: rgba(0, 0, 0, 0.26);
}

.slider-disabled .slider-thumb-label {
  display: none;
}

.slider-horizontal .slider-wrapper {
  height: 2px;
  top: 23px;
  left: 8px;
  right: 8px;
}

.slider-horizontal .slider-wrapper::after {
  height: 2px;
  border-left-width: 2px;
  right: 0;
  top: 0;
}

.slider-horizontal .slider-track-wrapper {
  height: 2px;
  width: 100%;
}

.slider-horizontal .slider-track-fill {
  height: 2px;
  width: 100%;
  transform: scaleX(0);
}

.slider-horizontal .slider-track-background {
  height: 2px;
  width: 100%;
  transform: scaleX(1);
}

.slider-horizontal .slider-ticks-container {
  height: 2px;
  width: 100%;
}

@media screen and (-ms-high-contrast: active) {
  .slider-horizontal .slider-ticks-container {
    height: 0;
    outline: solid 2px;
    top: 1px;
  }
}

.slider-horizontal .slider-ticks {
  height: 2px;
  width: 100%;
}

.slider-horizontal .slider-thumb-container {
  width: 100%;
  height: 0;
  top: 50%;
}

.slider-horizontal .slider-focus-ring {
  top: -15px;
  right: -15px;
}

.slider-horizontal .slider-thumb-label {
  right: -14px;
  top: -40px;
  transform: translateY(26px) scale(0.01) rotate(45deg);
}

.slider-horizontal .slider-thumb-label-text {
  transform: rotate(-45deg);
}

.slider-horizontal:focus .slider-thumb-label {
  transform: rotate(45deg);
}

@media screen and (-ms-high-contrast: active) {
  .slider-horizontal:focus .slider-thumb-label,
  .slider-horizontal:focus .slider-thumb-label-text {
    transform: none;
  }
}

.slider-vertical {
  width: 48px;
  min-height: 128px;
}

.slider-vertical .slider-wrapper {
  width: 2px;
  top: 8px;
  bottom: 8px;
  left: 23px;
}

.slider-vertical .slider-wrapper::after {
  width: 2px;
  border-top-width: 2px;
  bottom: 0;
  left: 0;
}

.slider-vertical .slider-track-wrapper {
  height: 100%;
  width: 2px;
}

.slider-vertical .slider-track-fill {
  height: 100%;
  width: 2px;
  transform: scaleY(0);
}

.slider-vertical .slider-track-background {
  height: 100%;
  width: 2px;
  transform: scaleY(1);
}

.slider-vertical .slider-ticks-container {
  width: 2px;
  height: 100%;
}

@media screen and (-ms-high-contrast: active) {
  .slider-vertical .slider-ticks-container {
    width: 0;
    outline: solid 2px;
    left: 1px;
  }
}

.slider-vertical .slider-focus-ring {
  bottom: -15px;
  left: -15px;
}

.slider-vertical .slider-ticks {
  width: 2px;
  height: 100%;
}

.slider-vertical .slider-thumb-container {
  height: 100%;
  width: 0;
  left: 50%;
}

.slider-vertical .slider-thumb {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.slider-vertical .slider-thumb-label {
  bottom: -14px;
  left: -40px;
  transform: translateX(26px) scale(0.01) rotate(-45deg);
}

.slider-vertical .slider-thumb-label-text {
  transform: rotate(45deg);
}

.slider-vertical:focus .slider-thumb-label {
  transform: rotate(-45deg);
}

[dir="rtl"] .slider-wrapper::after {
  left: 0;
  right: auto;
}

[dir="rtl"] .slider-horizontal .slider-track-fill {
  transform-origin: 100% 100%;
}

[dir="rtl"] .slider-horizontal .slider-track-background {
  transform-origin: 0 0;
}

[dir="rtl"] .slider-horizontal.slider-axis-inverted .slider-track-fill {
  transform-origin: 0 0;
}

[dir="rtl"] .slider-horizontal.slider-axis-inverted .slider-track-background {
  transform-origin: 100% 100%;
}

.slider._animation-noopable .slider-focus-ring,
.slider._animation-noopable .slider-has-ticks .slider-wrapper::after,
.slider._animation-noopable .slider-thumb,
.slider._animation-noopable .slider-thumb-container,
.slider._animation-noopable .slider-thumb-label,
.slider._animation-noopable .slider-thumb-label-text,
.slider._animation-noopable .slider-ticks,
.slider._animation-noopable .slider-track-background,
.slider._animation-noopable .slider-track-fill {
  transition: none;
}

.slider-track-fill,
.slider-thumb,
.slider-thumb-label {
  background-color: #ffd740;
}

.slider-thumb-label-text {
  color: rgba(0, 0, 0, 0.87);
}

.slider-track-background {
  background-color: rgba(0, 0, 0, 0.25);
}

.slider-horizontal {
  height: 48px;
  min-width: 256px;
}

.slider-min-value:not(.slider-thumb-label-showing) .slider-thumb {
  border-color: rgba(0, 0, 0, 0.26);
  background-color: transparent;
}

.slider-focused .slider-thumb {
  border-width: 2px;
  transform: scale(1);
}
</style>
