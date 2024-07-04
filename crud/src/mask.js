// Em um arquivo separado, por exemplo, diretivas/mask.js

import Vue from 'vue';

Vue.directive('mask', {
  bind(el, binding) {
    let mask = binding.value;
    el.addEventListener('input', function() {
      let val = this.value.replace(/\D/g, '');
      if (val.length > mask.length) {
        val = val.slice(0, mask.length);
      }
      let maskedVal = '';
      let maskCharIndex = 0;
      for (let i = 0; i < val.length; i++) {
        if (maskCharIndex >= mask.length) break;
        while (maskCharIndex < mask.length && mask[maskCharIndex] !== '#') {
          maskedVal += mask[maskCharIndex++];
        }
        maskedVal += val[i];
        maskCharIndex++;
      }
      this.value = maskedVal;
    });
  },
});
