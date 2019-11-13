<template>
  <div id="contentWrapper">
    <div id="chartTitle" ref="chartTitle">{{ this.title }}</div>

    <div id="chartWrapper" ref="chartWrapper">
      <svg id="chartSVG" ref="chartSVG">
        <g ref="chartGroup">
          <g ref="plotArea" transform="translate(0,0)" />
          <g ref="xAxis" class="xaxis axis" transform="translate(0, 300)"/>
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
      title: "How popular is Donald Trump",
      dataURL: "./data/approval_topline.csv",
      binding: { x: "modeldate", y: "disapprove_estimate" } // needs to map x and y to column names in the data
    };
  },
  methods: {

  }
};
</script>

<style>

.chartLine{
  fill: none;
  stroke: black;
}

#contentWrapper {
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content:start;
}

#chartWrapper {
  height: 300px;
  width:500px;
  margin-bottom: 40px;
  display: flex;
  align-items: flex-end;
  position: relative;
}

#chartSVG {
  margin: 0 auto;
  height:100%;
  width:100%;
  overflow: visible;
}

#chartTitle {
  left: -12px;
  color: rgb(46, 46, 46);
  position: relative;
  margin: 3em 0;
}
</style>