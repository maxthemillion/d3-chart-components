<template>
  <div id="pageWrapper">
    <div id="contentWrapper">
      <div id="chartTitle" ref="chartTitle" v-if="chartTitle !== null">{{ this.chartTitle }}</div>
      <div id="chartSubTitle" v-if="chartSubTitle !== null">{{this.chartSubTitle}}</div>
      <div id="chartWrapper" ref="chartWrapper">
        <div class="xAxisTitle" v-if="xAxisTitle !== null">{{this.xAxisTitle}}</div>
        <div class="yAxisTitle" v-if="yAxisTitle !== null">{{this.yAxisTitle}}</div>
        <svg id="chartSVG" ref="chartSVG">
          <g ref="chartGroup">
            <g ref="plotArea" transform="translate(0,0)" />
            <g ref="plotLegend" />
            <g ref="xAxis" class="xaxis axis" transform="translate(0, 300)" />
            <g ref="yAxis" class="yaxis axis" />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import LinechartCore from "../js/core_linechart.js";
import * as d3 from "d3";

export default {
  name: "Linechart",
  extends: LinechartCore,
  props: {
    chartTitle: {
      type: String,
      default: "Chart Title"
    },
    chartSubTitle: {
      type: String,
      default: "subtitle"
    },
    xAxisTitle: { type: String, default: "xAxis" },
    yAxisTitle: { type: String, default: "yAxis" },
    dataURL: String,
    binding: Object,
    colorScheme: {
      type: d3.colorScheme,
      default: function() {
        return d3.schemeBlues;
      }
    }
  },
  data: function() {
    return {};
  },
  methods: {}
};
</script>


<style>
.xAxisTitle {
  position: absolute;
  bottom: -50px;
  left: 10%;
}

.yAxisTitle {
  position: absolute;
  bottom: 10%;
  left: -50px;
  transform: rotate(-90deg);
  transform-origin: top left;
}

.chartLine {
  fill: none;
  stroke: black;
}

#pageWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#contentWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 500px;
}

#chartWrapper {
  height: 300px;
  width: 100%;
  position: relative;
}

#chartSVG {
  height: 100%;
  width: 100%;
  overflow: visible;
}

#chartTitle {
  font-size: 2em;
  color: rgb(46, 46, 46);
  margin: 0.5em 0 0 0;
  text-align: left;
  width: 100%;
}

#chartSubTitle {
  text-align: left;
  margin-bottom: 1em;
  width: 100%;
}
</style>