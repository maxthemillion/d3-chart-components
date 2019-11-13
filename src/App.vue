<template>
  <div  id="app">
    <Linechart v-bind="opts" />
  </div>
</template>

<script>
import Linechart from "./components/Linechart.vue";
import * as d3 from "d3"

export default {
  name: "app",
  components: {
    Linechart
  },
  data(){
    return{
      opts:{
        dataURL: "./data/approval_topline.csv",
        chartTitle: "How unpopular is Donald Trump?",
        binding:  { x: "modeldate", y: "disapprove_estimate", color: "subgroup"},
        colorScheme: d3.schemeTableau10
      }
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
