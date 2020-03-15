import app from './App.vue';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  install: function (Vue, options) {
    Vue.component('vue-clock', app);
  }
};