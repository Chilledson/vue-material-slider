<script>

import BaseSlider from './base-slider'

export default {
  name: "vue-material-slider",
  extends: BaseSlider,
  render() {
    return this.createSlider()
  }
};
</script>

<style lang="scss">
  @import './slider.scss';
</style>
