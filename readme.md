# vue-material-slider
This is a port of the [Angular material slider](https://material.angular.io/components/slider/overview), currently only basic features but more are on the way. 

## Contents
-  [Installation](#installation)
-  [Usage](#usage)
-  [ToDo's](#todo)

## Installation
```
npm install vue-material-slider --save
```
## Usage
Import and use in vue

```javascript
import  Vue  from  'vue'
import  VueMaterialSlider  from  'vue-material-slider'
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
## Todo

|Feature|Done?|
|--|--|
|Min/max  | Y |
|v-model integration| Y |
|Orientation  | N |
|Keyboard support| N |
|Thumb label| N |
|Custom theming| N |
|Step| N |
