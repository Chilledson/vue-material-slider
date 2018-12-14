# Vue Material Slider
This is a port of the [Angular material slider](https://material.angular.io/components/slider/overview), currently only basic features but more are on the way. 

## Contents
- [Vue Material Slider](#vue-material-slider)
  - [Contents](#contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Properties](#properties)
  - [Todo](#todo)

## Installation
```
npm install vue-material-slider --save
```
## Usage
Import and use in vue

```javascript
import Vue from 'vue'
import VueMaterialSlider from 'vue-material-slider'
Vue.use(VueMaterialSlider)
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


## Todo

|Feature|Done?|
|--|--|
|Min/max  | Y |
|v-model integration| Y |
|Orientation  | Y |
|Keyboard support| Y |
|Thumb label| Y |
|Custom theming| N |
|Step| N |
