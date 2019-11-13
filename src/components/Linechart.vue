<template>
  <div id="contentWrapper">
    <div id="chartTitle" ref="chartTitle">{{ this.chartTitle }}</div>

    <div id="chartWrapper" ref="chartWrapper">
      <svg id="chartSVG" ref="chartSVG">
        <g ref="chartGroup">
          <g ref="plotArea" transform="translate(0,0)" />
          <g ref="xAxis" class="xaxis axis" transform="translate(0, 300)" />
          <g ref="yAxis" clas="yaxis axis" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import LinechartCore from "../js/core_linechart.js";
import * as d3 from "d3"

export default {
  name: "Linechart",
  extends: LinechartCore,
  props: {
    chartTitle: {
      type: String,
      default: "Chart Title"
    },
    dataURL: String,
    binding: Object,
    colorScheme: {
      type: d3.colorScheme,
      default: function(){return d3.schemeBlues}
    }
  },
  data: function() {
    return {
    };
  },
  methods: {}
};
</script>

<style>
.chartLine {
  fill: none;
  stroke: black;
}

#contentWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}

#chartWrapper {
  height: 300px;
  width: 500px;
  margin-bottom: 40px;
  display: flex;
  align-items: flex-end;
  position: relative;
}

#chartSVG {
  margin: 0 auto;
  height: 100%;
  width: 100%;
  overflow: visible;
}

#chartTitle {
  left: -12px;
  color: rgb(46, 46, 46);
  position: relative;
  margin: 3em 0;
}
</style>