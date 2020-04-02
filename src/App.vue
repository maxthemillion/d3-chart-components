<template>
  <div  id="app">
    <Linechart v-bind="opts" />
  </div>
</template>

<script>
import Linechart from "@/components/Chart/Line/LineChart.vue";

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

