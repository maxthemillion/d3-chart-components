<template>
  <div id="pageWrapper">
    <div id="contentWrapper">
      <div id="chartTitle" ref="chartTitle" v-if="chartTitle !== null">{{ this.chartTitle }}</div>
      <div id="chartSubTitle" v-if="chartSubTitle !== null">{{this.chartSubTitle}}</div>
      <div id="chartWrapper" ref="chartWrapper">
        <div class="xAxisTitle axisTitle" v-if="xAxisTitle !== null">{{this.xAxisTitle}}</div>
        <div class="yAxisTitle axisTitle" v-if="yAxisTitle !== null">{{this.yAxisTitle}}</div>
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
      <div id="comment"><b>{{this.commentTitle}}</b> - {{this.comment}}</div>
    </div>
  </div>
</template>

<script>
import LinechartCore from "../js/core_linechart.js";
import * as moment from "moment";
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
    comment: { type: String, default: "comment" },
    commentTitle: {type: String, default: "comment title"},
    xAxisTitle: { type: String, default: "xAxis" },
    yAxisTitle: { type: String, default: "yAxis" }
  },
  data: function() {
    return {};
  },
  methods: {
    nestData: function(data) {
      const _this = this;
      const res = d3
        .nest()
        .key(function(d) {
          return d[_this.binding.color];
        })
        .key(function(d) {
          return d[_this.binding.x];
        })
        .rollup(function(l) {
          return l
            .map(function(d) {
              return d[_this.binding.y];
            })
            .reduce((a, b) => a + b, 0);
        })
        .entries(data);

      return res;
    },
    flattenData: function(data) {
      let outer = [];
      data.forEach(function(a) {
        let inner = [];
        a.values.forEach(function(b) {
          inner.push({
            color: a.key,
            x: moment(parseInt(b.key)),
            y: b.value
          });
        });
        outer.push(inner);
      });

      return outer;
    },
    transformData: function(data) {
      /**
       *   transformData needs to be changed according to the structure of the data.
       *   output data format is [{color: 'xx', x: 'xx',y: 'xx'},...]
       **/
      const nestedData = this.nestData(data);
      const vizData = this.flattenData(nestedData);
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
  bottom: -40px;
  left: 10%;
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
  margin-top: 50px;
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