<template>
  <div id="pageWrapper">
    <div id="contentWrapper">
      <div id="chartTitle" ref="chartTitle">{{ this.chartTitle }}</div>
      <div id="chartWrapper" ref="chartWrapper">
        <div class="xAxisTitle">{{this.xAxisTitle}}</div>
        <div class="yAxisTitle">{{this.yAxisTitle}}</div>
        <svg id="chartSVG" ref="chartSVG">
          <g ref="chartGroup">
            <g ref="plotArea" transform="translate(0,0)" />
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
    dataURL: String,
    binding: Object,
    colorScheme: {
      type: d3.colorScheme,
      default: function() {
        return d3.schemeBlues;
      }
    },
    useRough: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      xAxisTitle: "xAxis",
      yAxisTitle: "yAxis"
    };
  },
  methods: {}
};
</script>


<style>

.xAxisTitle {
  position: absolute;
  bottom: -50px;
  left: 45%;
}

.yAxisTitle {
  position: absolute;
  top: 128px;
  left: -50px;
  transform: rotate(-90deg);
}

.chartLine {
  fill: none;
  stroke: black;
}

#pageWrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
}

#contentWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width:500px;
}

#chartWrapper {
  height: 300px;
  width:100%;
  position: relative;
}

#chartSVG {
  height: 100%;
  width: 100%;
  overflow: visible;
}

#chartTitle {
  font-size:2em;
  color: rgb(46, 46, 46);
  margin: 2em 0;
  text-align: left;
  width: 100%
}
</style>