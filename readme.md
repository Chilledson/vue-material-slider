# vue-material-slider

## Contents
- [Installation](#installation)
- [Usage](#usage)

# Installation

```
npm install vue-material-slider --save
```

# Usage

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