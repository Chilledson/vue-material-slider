<script>
import BaseSlider from './base-slider'

const CLASS_NAME = 'slider';

export default {
  name: "vue-material-slider",
  extends: BaseSlider,
  computed: {
    baseCls() {
      return CLASS_NAME
    }
  },
  render() {
    return this.createSlider()
  }
};
</script>

<style lang="scss">
  @import './slider.scss';
</style>
