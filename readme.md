# Vue Material Slider
A material design slider build with vue.
[Live demo](https://codesandbox.io/s/priceless-raman-6s9ey?file=/src/App.vue)

## Contents
- [Vue Material Slider](#vue-material-slider)
  - [Contents](#contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Properties](#properties)

## Installation
```
npm install vue-material-slider --save
```
## Usage
Import and use in vue

```javascript
import Vue from 'vue'
import "vue-material-slider/dist/lib/vue-material-slider.css";
import VueMaterialSlider from "vue-material-slider";
Vue.component("vue-material-slider", VueMaterialSlider);
```
Use in your components
```html
<vue-material-slider
:min="10"
:max="20"
v-model="value"
></vue-material-slider>
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

