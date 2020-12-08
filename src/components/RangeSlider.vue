<script>
import { indexOFClosest, isEqual } from "./helpers/util";
import BaseSlider from "./base-slider";

export default {
  name: "vue-material-slider",
  extends: BaseSlider,
  props: {
    value: {
      type: Array,
      default: () => [10, 50, 75],
    }
  },
  data() {
    return {
      localValue: this.value,
      localPercent: [0, 0],
    };
  },
  mounted() {
    this.sliderDimensions = this.getSliderDimensions();

    this.value.forEach((v, i) => {
      this.setActiveThumb(i);
      this.setLocalValue(v);
    });

    this.setActiveThumb(null);
  },
  computed: {
    maxThumbIndex() {
      return this.localValue.indexOf(Math.max(...this.localValue));
    },
    minThumbIndex() {
      return this.localValue.indexOf(Math.min(...this.localValue));
    },
    percent() {
      return this.localPercent.map((v) => this.clamp(v));
    },
    isMinValue() {
      return this.percent.every(v => v === 0);
    },
    displayValue() {
      let value = this.localValue[this.activeThumb];

      if (this.displayWith) {
        return this.displayWith(value);
      }

      // When incrementing using a decimal value make sure its rounded
      if (this.roundToDecimal && value && value % 1 !== 0) {
        return value.toFixed(this.roundToDecimal);
      }

      return value;
    },
  },
  methods: {
    emitInputEvent(newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        this.$emit("input", newValue);
      }
    },
    setLocalValue(v) {
      if (v !== this.localValue) {
        let value = v;
        // While incrementing by a decimal we can end up with values like 33.300000000000004.
        // Truncate it to ensure that it matches the label and to make it easier to work with.
        if (this.roundToDecimal) {
          value = parseFloat(value.toFixed(this.roundToDecimal));
        }

        // When using multiple thumbs find the closest
        if (this.activeThumb === null) {
          this.activeThumb = this.getClosestThumb(this.localValue, v);
        }

        const oldValue = [...this.localValue];

        this.localValue.forEach((currentValue, i) => {
          if (i === this.activeThumb) {
            this.$set(this.localValue, i, value);
            this.$set(this.localPercent, i, this.calculatePercentage(value));
          } else {
            this.$set(this.localValue, i, Number(currentValue));
            this.$set(this.localPercent, i, this.calculatePercentage(Number(currentValue)));
          }
        });

        this.emitInputEvent(this.localValue, oldValue);
      }
    },
    onSlideEnd() {
      BaseSlider.options.methods.onSlideEnd.call(this);
      // Reset the thumb
      this.setActiveThumb(null);
    },
    getClosestThumb(array, value) {
      const index = indexOFClosest(array, value);
      return array.indexOf(index);
    },
    setActiveThumb(index) {
      this.activeThumb = index;
    },
    increment(numSteps) {
      if (this.activeThumb === null) {
        return;
      }

      let value = this.clamp(
        (this.localValue[this.activeThumb] || 0) + this.step * numSteps,
        this.min,
        this.max
      );

      this.setLocalValue(value);
    },
    getTrackDimensions(percents, index) {
      const size = this.vertical
        ? this.sliderDimensions.height
        : this.sliderDimensions.width;

      let percent;
      let offset;

      if (index === 0) {
        // Renders the first section leading from the start of the slider to the first thumb
        percent = percents[index];
        offset = -this.thumbGap;
      } else if (index > 0 && index < percents.length) {
        const thumbGap = this.thumbGap * 2;
        const thumbGapPercent = -(thumbGap * 100 / size) / 100;
        // Calculate inbetween the current thumb and the next
        percent = percents[index - 1] - percents[index] - thumbGapPercent;
        // Calculate the amount to trim off either side of the track when there is a thumbGap
        offset = size * percents[index] - this.thumbGap;
      } else if (index === percents.length) {
        // From last to the end 
        percent = 1 - percents[this.maxThumbIndex]
        offset = size * percents[this.maxThumbIndex] + this.thumbGap;
      }

      return {
        percent,
        offset
      }
    },
    trackBackgroundStyles(percents, index) {
      if (!this.sliderDimensions) {
        return;
      }

      const { percent, offset } = this.getTrackDimensions(percents, index);
      const axis = this.vertical ? "Y" : "X";
      const sign = this.shouldInvertMouseCoords() ? "-" : "";
      const scale = this.vertical 
        ? `1, ${percent}, 1`
        : `${percent}, 1, 1`;

      return {
        transform: `translate${axis}(${sign}${offset}px) scale3d(${scale})`,
      };
    },
    trackFillStyles(percents) {
      if (!this.sliderDimensions) {
        return;
      }

      const axis = this.vertical ? "Y" : "X";
      const sign = this.shouldInvertMouseCoords() ? "-" : "";
      const size = this.vertical
        ? this.sliderDimensions.height
        : this.sliderDimensions.width;
      // Find the difference between the minimum and maximum thumb
      const trim = this.thumbGap * percents.length;
      const trimPercent = trim / size * 100;
      // Calculate inbetween the first thumb and the last thumb
      const percent = percents[this.maxThumbIndex] - percents[this.minThumbIndex] - this.calculatePercentage(trimPercent);
      // offset from the minimum thumb
      const offset = size * percents[this.minThumbIndex];
      const scale = this.vertical ? `1, ${percent}, 1` : `${percent}, 1, 1`;

      return {
        transform: `translate${axis}(${sign}${offset + this.thumbGap}px) scale3d(${scale})`,
      };
    },
    createChildren() {
      const thumbs = this.localValue.map((_, i) => {
        const onSlideStart = () => {
          if (this.disabled) return;

          this.setActiveThumb(i);
        };
        const onFocus = () => {
          if (this.disabled) return;

          this.isActive = true;
          this.setActiveThumb(i);
        };
        const onBlur = () => {
          this.setActiveThumb(null);
        };

        const listeners = {
          touchstart: onSlideStart,
          mousedown: onSlideStart,
          focus: onFocus,
          blur: onBlur,
        };

        const isActive = this.activeThumb === i;

        return this.createThumb(this.localPercent[i], listeners, isActive);
      });

      return [this.createTrack(), ...thumbs];
    },
    createTrack() {
      const h = this.$createElement;

      let background = [];

      for (let i = 0; i < this.localValue.length + 1; i++) {
        let section = h('div', { 
          staticClass: 'slider-track-background',
          style: this.trackBackgroundStyles(this.percent, i),
          key: `'slider-track-background-${i}`
        });

        background.push(section)
      }

      return h('div', { 
        staticClass: 'slider-track-wrapper'
      }, [...background, this.createTrackFill(this.percent)]);
    },
    createTrackFill(percent) {
      const h = this.$createElement;
      return h("div", {

        staticClass: "slider-track-fill",
        style: this.trackFillStyles(percent),
      });
    },
  },
  render() {
    return this.createSlider();
  },
};
</script>

<style lang="scss">
@import "./slider.scss";

.slider-track-wrapper .slider-track-background {
  transform-origin: 0 0; 
}

.slider-disabled .slider-track-fill {
  display: none;
}

</style>