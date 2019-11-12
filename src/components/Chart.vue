<template>
  <div>
    <div id="chartTitle" ref="chartTitle">{{ this.title }}</div>

    <div id="chartWrapper" ref="chartWrapper">
      <svg id="chartSVG" ref="chartSVG">
        <g ref="chartGroup">
          <g ref="plotArea" />
          <g ref="xAxis" class="xaxis axis" />
          <g ref="yAxis" clas="yaxis axis" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import Chart from "../js/chart.js";

export default {
  name: "TrumpChart",
  extends: Chart,
  data: function() {
    return {
      title: "Chart Test",
      dataURL: "./data/impeachment-polls.csv"
    };
  },
  methods: {
    fetchData: async function() {
      const _this = this;
      this.data = await d3.csv(dataURL, d3.autoType)
    },
  }
};
</script>

<style scoped>
#chartWrapper {
  height: 100px;
  margin-bottom: 40px;
  display: flex;
  align-items: flex-end;
  position: relative;
}

#chartSVG {
  display: block;
  width: 100%;
  height: 70%;
  margin: 0 auto;
  overflow: visible;
}

#chartTitle {
  left: -12px;
  color: white;
  position: relative;
}
</style>