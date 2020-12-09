# Vue Material Slider
A material design slider build with vue.
[Live demo](https://codesandbox.io/s/priceless-raman-6s9ey?file=/src/App.vue)

## Contents
- [Vue Material Slider](#vue-material-slider)
  - [Contents](#contents)
  - [Installation](#installation)
  - [Import](#import)
  - [Basic slider](#basic-slider)
  - [Range Slider](#range-slider)
  - [Properties](#properties)

## Installation
```
npm install vue-material-slider --save
```
## Import
Import and use in vue individually

```javascript
import Vue from 'vue'
import "vue-material-slider/dist/vue-material-slider.css";
import { Slider, RangeSlider }  from "vue-material-slider";
```
Install all at once

```javascript
import 'vue-material-slider/dist/vue-material-slider.css';
import VueMaterialSlider from 'vue-material-slider';
Vue.use(VueMaterialSlider);
```
## Basic slider
Use in your components
```html
<template>
  <vue-material-slider
    :min="10"
    :max="20"
    v-model="value"
  />
</template>

<script>
export default {
  data() {
    return {
      value: 0
    }
  }
}
</script>
```
## Range Slider
```html
<template>
  <vue-material-range-slider v-model="value" />
</template>

<script>
export default {
  data() {
    return {
      // Each array value corresponds to a new thumb
      value: [0, 25, 50]
    }
  }
}
</script>
```
## Properties
| Prop| Type| default| Description |
| --- | --- | --- |--- |
| min | number | 0 | The minimum value of the slider |
| max | number | 100| The maximum value of the slider |
| thumbLabel | boolean | false | Whether or not to show the label |
| invert | boolean | false| Set to true to reverse the slider |
| vertical | boolean | false | Set to true to make the slider vertical |
| displayWith| function | null | Function that will be used to format the value before it is displayed in the thumb label. Can be used to format very large number in order for them to fit into the slider thumb. |
| disabled | boolean | false| Whether the component is disabled.|
| stepSize | number | 1 | The size of each step |

