# vue-material-slider

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

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
## Todo

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
