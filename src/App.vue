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
        dataURL: "./data/approval_allpolls.csv",
        chartTitle: "How unpopular is Donald Trump?",
        chartSubTitle: "Share of respondents disapproving the president (in %)",
        commentTitle: "The unwanted president",
        comment: "Disapproval among Voters increased sharply right after his inauguration but levelled of at a stabl 50-55 percent shortly after.",
        binding:  { x: "modeldate", y: "disapprove_estimate", color: "subgroup"},
        xAxisTitle: "Time in office",
        yAxisTitle: null,
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
