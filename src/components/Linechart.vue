<template>
  <div id="pageWrapper">
    <div id="contentWrapper">
      <div id="chartTitle" ref="chartTitle" v-if="chartTitle !== null">
        {{ this.chartTitle }}
      </div>
      <div id="chartSubTitle" v-if="chartSubTitle !== null">
        {{ this.chartSubTitle }}
      </div>
      <div id="chartWrapper" ref="chartWrapper">
        <div class="xAxisTitle axisTitle" v-if="xAxisTitle !== null">
          {{ this.xAxisTitle }}
        </div>
        <div class="yAxisTitle axisTitle" v-if="yAxisTitle !== null">
          {{ this.yAxisTitle }}
        </div>
        <svg id="yAxisViewport">
          <g ref="yAxis" class="yaxis axis" transform="translate(50, 0)" />
        </svg>
        <svg id="chartSVG" ref="chartSVG">
          <g ref="chartGroup">
            <g ref="plotArea" transform="translate(0,0)" />
            <g ref="plotLegend" />
          </g>
        </svg>
        <svg id="xAxisViewport">
          <g ref="xAxis" class="xaxis axis" />
        </svg>
      </div>
      <div id="comment">
        <b>{{ this.commentTitle }}</b> - {{ this.comment }}
      </div>
    </div>
  </div>
</template>

<script>
import LinechartCore from "../js/core_linechart.js";
import * as moment from "moment";

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
    comment: { type: String, default: "comment" },
    commentTitle: { type: String, default: "comment title" },
    xAxisTitle: { type: String, default: "xAxis" },
    yAxisTitle: { type: String, default: "yAxis" }
  },
  data: function() {
    return {};
  },
  methods: {
    convert: function(datum, type) {
      if (type === "Q" || type === "N") {
        return datum;
      } else if (type === "T") {
        return moment(parseInt(datum));
      } else if (type === "P"){
        return datum*100
      }
    },
    transformData: function(data) {
      const _this = this
      
      // [ {color:A, x:v, y:v}, {color:A, x:v, y:v},  ...]
      const vizData = data.map(function(d) {
        return {
          x: _this.convert(d[_this.binding.x], _this.binding.xType),
          y: _this.convert(d[_this.binding.y], _this.binding.yType),
          color: _this.convert(d[_this.binding.color], _this.binding.colorType)
        };
      });
      return vizData;
    }
  }
};
</script>

<style>
.axisTitle {
  font-size: small;
  font-weight: bold;
}

.xAxisTitle {
  position: absolute;
  bottom: 2px;
  right: 0;
}

.yAxisTitle {
  position: absolute;
  bottom: 10%;
  left: -40px;
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
  max-width: 800px;
}

#chartWrapper {
  height: 300px;
  width: 100%;
  position: relative;
}

#chartSVG {
  height: 100%;
  width: 100%;
  overflow: hidden;
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

#comment {
  margin-top: 30px;
  width: 100%;
  text-align: left;
  font-size: x-small;
}

#xAxisViewport {
  width: 100%;
  overflow: visible;
  position: absolute;
  height: 50px;
  bottom: -50px;
  left: 0;
}
#yAxisViewport {
  overflow: visible;
  width: 50px;
  height: 100%;
  position: absolute;
  left: -50px;
}
</style>
