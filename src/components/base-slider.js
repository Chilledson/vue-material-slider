import Vue from 'vue'
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
const DISABLED_THUMB_GAP = {name: '--disabled-thumb-gap', fallback: '7px'};

/** The thumb gap size for a non-active slider at its minimum value. */
const MIN_VALUE_NONACTIVE_THUMB_GAP = {name: '--min-value-nonactive-thumb-gap', fallback: '7px'};

/** The thumb gap size for an active slider at its minimum value. */
const MIN_VALUE_ACTIVE_THUMB_GAP = {name: '--min-value-active-thumb-gap', fallback: '10px'};

/** Emits a CSS expression referencing one of the above variables or a numeric literal. */
function referenceCssVariable(negative, variable) {
  if (typeof variable === 'number') {
    return negative ? `-${variable}px` : `${variable}px`;
  } else {
    return negative ?
        `calc(0px - var(${variable.name}, ${variable.fallback}))` :
        `var(${variable.name}, ${variable.fallback})`;
  }
}

/** Returns the window element for the givent el. */
function getWindowForElement(element) {
  var doc = element.ownerDocument || element;
  return doc.defaultView || doc.parentWindow || window;
}

export default Vue.extend({
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
      default: null
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
      localValue: 0,
      localValueOnSlideStart: null,
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

    this.sliderDimensions = this.getSliderDimensions();
    this.setLocalValue(this.value);

    // Set initial values
    this.step = this.stepSize;
  },
  methods: {
    thumbContainerStyles(percent) {
      let axis = this.vertical ? "Y" : "X";
      // For a horizontal slider in RTL languages we push the thumb container off the left edge
      // instead of the right edge to avoid causing a horizontal scrollbar to appear.
      let invertOffset =
        this.getDirection() == "rtl" && !this.vertical
          ? !this.invertAxis
          : this.invertAxis;
      let offset = (invertOffset ? percent : 1 - percent) * 100;

      return {
        transform: `translate${axis}(-${offset}%)`,
      };
    },
    trackBackgroundStyles(percent) {
      const axis = this.vertical ? "Y" : "X";
      const scale = this.vertical
        ? `1, ${1 - percent}, 1`
        : `${1 - percent}, 1, 1`;
      const neg = this.shouldInvertMouseCoords();

      return {
        // scale3d avoids some rendering issues in Chrome. See #12071.
        transform: `translate${axis}(${referenceCssVariable(neg, this.thumbGap)}) scale3d(${scale})`,
      };
    },
    trackFillStyles(percent) {
      const axis = this.vertical ? "Y" : "X";

      const scale = this.vertical
        ? `1, ${percent}, 1`
        : `${percent}, 1, 1`;
      const neg = !this.shouldInvertMouseCoords();

      return {
        // scale3d avoids some rendering issues in Chrome. See #12071.
        transform: `translate${axis}(${referenceCssVariable(neg, this.thumbGap)}) scale3d(${scale})`,
      };
    },
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

      this.isSliding = false;
      this.focusHostElement();

      const position = this.getTouchPoint(event);
      this.updateValueFromPosition(position);

      // Emit a change and input event if the value changed.
      this.emitChangeEvent();
    },
    onSlide(event) {
      if (this.disabled || !this.isActive) {
        return;
      }

      this.isSliding = true;

      event.preventDefault();

      const position = this.getTouchPoint(event);
      this.updateValueFromPosition(position);
    },
    onSlideStart(event) {
      if (this.disabled || this.isSliding) {
        return;
      }

      // Simulate mouseenter in case this is a mobile device.
      this.onMouseenter();
      this.focusHostElement();

      this.localValueOnSlideStart = this.localValue;

      if (event) {
        const position = this.getTouchPoint(event);
        this.updateValueFromPosition(position);
        event.preventDefault();
      }
    },
    onSlideEnd() {
      this.isSliding = false;

      if (this.localValueOnSlideStart !== null && !this.disabled) {
        this.emitChangeEvent();
      }

      this.localValueOnSlideStart = null;
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

      let value;

      // Since the steps may not divide cleanly into the max value, if the user
      // slide to 0 or 100 percent, we jump to the min/max value. This approach
      // is slightly more intuitive than using `Math.ceil` below, because it
      // follows the user's pointer closer.
      if (percent === 0) {
        value = this.min;
      } else if (percent === 1) {
        value = this.max;
      } else {
        const exactValue = this.calculateValue(percent);
        // This calculation finds the closest step by finding the closest
        // whole number divisible by the step relative to the min.
        const closestValue =
          Math.round((exactValue - this.min) / this.step) * this.step +
          this.min;
        // The value needs to snap to the min and max.
        value = this.clamp(closestValue, this.min, this.max);
      }

      this.setLocalValue(value);
    },
    onKeydown(event) {
      if (this.disabled) {
        return;
      }

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

      this.emitChangeEvent();

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
    emitInputEvent(newValue, oldValue) {
      if (newValue != oldValue) {
        this.$emit("input", newValue);
      }
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

        this.emitInputEvent(this.localValue, v);
      }
    },
    createSlider() {
      const h = this.$createElement;
      // Create track, thumbs etc..
      const children = this.createChildren();
      const wrapper = this.createWrapper(children)
      return h('div', {
        staticClass: this.baseCls,
        class: {
          'slider-disabled': this.disabled,
          'slider-vertical': this.vertical,
          'slider-sliding': this.isSliding,
          'slider-horizontal': !this.vertical,
          'slider-axis-inverted': this.invertAxis,
          'slider-focused': this.isActive,
          'slider-thumb-label-showing': this.thumbLabel,
        },
        on: {
          mouseenter: this.onMouseenter,
          mousedown: this.onMousedown,
          keydown: this.onKeydown,
          focus: this.onFocus,
          keyup: this.onKeyup,
          blur: this.onBlur,
        },
      }, [wrapper]);
    },
    createChildren() {
      return [
        this.createTrack(),
        this.createThumb(this.percent),
      ];
    },
    createWrapper(children) {
      const h = this.$createElement;
      return h('div', {
        ref: "slider",
        staticClass: 'slider-wrapper',
        class: { 'slider-sliding': this.isSliding }
      }, children);
    },
    createTrackFill(percent) {
      const h = this.$createElement;
      return h('div', {
        staticClass: 'slider-track-fill',
        style: this.trackFillStyles(percent)
      });
    },
    createTrack() {
      const h = this.$createElement;

      const background = h('div', {
        staticClass: 'slider-track-background',
        style: this.trackBackgroundStyles(this.percent)
      });

      return h('div', {
        staticClass: 'slider-track-wrapper'
      }, [background, this.createTrackFill(this.percent)]);
    },
    createThumb(percent, listeners = {}, isActive = this.isActive) {
      const h = this.$createElement;

      const thumbText = isActive
        ? h('span', {
            staticClass: 'slider-thumb-label-text'
          }, this.displayValue)
        : h();
      const focusEl = h('div', { staticClass: 'slider-focus-ring' });
      const thumb = h('div', { staticClass: 'slider-thumb' });
      const thumbLabel = h('div', { staticClass: 'slider-thumb-label' }, [thumbText]);

      return h('div', {
        staticClass: 'slider-thumb-container',
        class: {
          'slider-thumb-active': isActive,
          'slider-min-value': this.isMinValue,
        },
        style: this.thumbContainerStyles(percent),
        on: { ...listeners },
        attrs: {
          tabindex: 0
        }
      }, [
        focusEl,
        thumb,
        thumbLabel
      ]);
    }
  }
});
