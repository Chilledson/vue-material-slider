import Vue from 'vue'

export default Vue.extend({

})

/** 
 * 
 * if (Array.isArray(value)) {
            if (this.roundToDecimal) {
              value = value.map((v) =>
                parseFloat(v.toFixed(this.roundToDecimal))
              );
            }
          } else {
            // While incrementing by a decimal we can end up with values like 33.300000000000004.
            // Truncate it to ensure that it matches the label and to make it easier to work with.
            if (this.roundToDecimal) {
              value = parseFloat(value.toFixed(this.roundToDecimal));
            }
          }

*/