<template>
  <div  id="app">
    <Linechart v-bind="opts" />
  </div>
</template>

<script>
import Linechart from "./components/Linechart.vue";
import './style.scss'

export default {
  name: "app",
  components: {
    Linechart
  },
  props: {
    opts: {
      type: Object
    } 
  }
};
</script>

<style>
#app {
  font-family: 'Raleway';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
