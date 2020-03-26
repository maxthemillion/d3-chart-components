import * as d3 from "d3";
import Vue from "vue";
import AnnotationMarker from "../AnnotationMarker.vue";

export default {
  name: "LinechartCore",
  props: {
    xDomain: {
      type: Array,
      default: function() {
        return null; //TODO: it doesn't work to set the xDomain yet. Seems to be some problem with scales
      }
    },
    yIncludeZero: {
      type: Boolean,
      default: true
    },
    yDomain: {
      type: Array,
      default: function() {
        return null;
      }
    },
    format:{
      type: Object,
      default: function() {
        return(
          {
            y: d3.format('.1f'),
            x: d3.format('.1f')
          }
        )
      }
    },
    dataURL: String,
    binding: Object,
    colorScheme: {
      type: Array,
      default: function() {
        return d3.schemeBlues[8];
      }
    },
    colorHighlight: {
      type: Array,
      default: function() {
        return null;
      }
    },
    annotations: {
      type: Array,
      default: function() {
        return null;
      }
    },
    scale: {
      type: Object,
      default: function() {
        return {
          x: d3.scaleLinear(),
          y: d3.scaleLinear(),
          color: d3.scaleOrdinal(),
        };
      },
    },
    interactive: {
      type: Object,
      default: function() {
        return {
          zoom: false,
          hover: true
        };
      }
    },
    tick:{
      type: Object,
      default: function() {
        return ({
          frequency: null
        })
      }
    }
  },
  data() {
    return {
      axis: {},
      select: {},
      domain: { x: {}, y: {} },
      rawData: {},
      vizData: {},
      zoom: {},
      layout: {
        yaxis: {
          tickToRightThreshold: 500
        },
        line: {
          standardColor: "#bfbfbf",
          strokeWidth: 1.5
        },
        legend: {
          standardColor: "#737373",
          fontSize: 11,
        }
      }
    };
  },
  watch: {},
  methods: {
    setReferences() {
      this.select.svg = d3.select(this.$refs.chartSVG);
      this.select.chartGroup = d3.select(this.$refs.chartGroup);
      this.select.xAxis = d3.select(this.$refs.xAxis);
      this.select.yAxis = d3.select(this.$refs.yAxis);
      this.select.plotArea = d3.select(this.$refs.plotArea);
      this.select.plotLegend = d3.select(this.$refs.plotLegend);
    },
    setDomain() {
      const _this = this;

      let xVals = [...new Set(_this.vizData.map(d => d.x))];
      let yVals = [...new Set(_this.vizData.map(d => d.y))];

      let xc
      let yc

      if (this.xDomain !== null) {
        xc = this.xDomain
      } else {
        xc = xVals
      }
      this.domain.x.max = d3.max(xc)
      this.domain.x.min = d3.min(xc)

      if (this.yDomain !== null) {
        yc = this.yDomain
      } else if (this.yIncludeZero) {
        yc = yVals
        yc.push(0)
      } else {
        yc=yVals 
      }
      this.domain.y.max = d3.max(yc)
      this.domain.y.min = d3.min(yc)
    },
    setScales() {
      this.scale.color.range(this.colorScheme)

      this.plotWidth = this.select.svg.node().getBoundingClientRect().width;
      this.plotHeight = this.select.svg.node().getBoundingClientRect().height;

      this.scale.x
        .range([0, this.plotWidth])
        .domain([this.domain.x.min, this.domain.x.max])
        .nice()

      this.scale.y
        .range([this.plotHeight, 0])
        .domain([this.domain.y.min, this.domain.y.max])
        .nice()
    },
    setZoom() {
      if (!this.interactive.zoom) return;

      this.zoom = d3
        .zoom()
        .scaleExtent([1, 2])
        .on("zoom", zoomed);

      this.select.svg.call(this.zoom);

      const _this = this;

      function zoomed() {
        _this.select.plotArea.attr("transform", d3.event.transform);
        _this.select.xAxis.call(
          _this.axis.x.scale(d3.event.transform.rescaleX(_this.scale.x))
        );
        _this.select.yAxis.call(
          _this.axis.y.scale(d3.event.transform.rescaleY(_this.scale.y))
        );

        const bBox = _this.select.plotArea.node().getBBox();
        const topLeft = [bBox.x, bBox.y];
        const bottomRight = [bBox.x + bBox.width, bBox.y + bBox.height];
        _this.zoom.translateExtent([topLeft, bottomRight]);
      }
    },
    appendPlotElements: function() {
      const _this = this;

      let lineData = d3
        .nest()
        .key(function(d) {
          return d.color;
        })
        .rollup(function(l) {
          return l.map(d => {
            return { y: d.y, x: d.x };
          });
        })
        .entries(this.vizData);

      this.select.lines = this.select.plotArea
        .append("g")
        .selectAll("g")
        .data(lineData)
        .join("g");

      this.select.path = this.select.lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", function(d) {
          return _this.colorHighlight === null ||
            _this.colorHighlight.indexOf(d.key) > -1
            ? _this.scale.color(d.key)
            : _this.layout.line.standardColor;
        })
        .attr("stroke-width", _this.layout.line.strokeWidth)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");

      this.select.lines
        .append("text")
        .text(d => d.key)
        .attr("font-size", this.layout.legend.fontSize)
        .attr("fill", function(d) {
          return _this.colorHighlight === null ||
            _this.colorHighlight.indexOf(d.key) > -1
            ? _this.scale.color(d.key)
            : _this.layout.legend.standardColor;
        });

      this.select.svg.call(_this.hover, _this.select.lines);
    },
    hover(svg, lines) {
      if (!this.interactive.hover) return

      const _this = this;

      svg
        .on("touchstart", entered)
        .on("touchmove", moved)
        .on("touchend", left)
        .on("mouseenter", entered)
        .on("mouseleave", left)
        .on("mousemove", moved);

      const dot = this.select.plotArea.append("g").attr("display", "none");

      dot.append("circle").attr("r", 2.5);

      dot
        .append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("y", -8);

      function entered() {
        lines.transition().style("opacity", 0.3);

        dot.attr("display", null);
      }

      function moved() {
        d3.event.preventDefault();

        let pos;
        if ("ontouchstart" in document) {
          pos = d3.touches(_this.select.plotArea.node())[0];
        } else {
          pos = d3.mouse(_this.select.plotArea.node());
        }
        
        let uniqueX, xPosVal
        if(_this.binding.xType === 'T'){
          uniqueX = [...new Set(_this.vizData.map(d => d.x.valueOf()))].sort((a, b) => a - b);
          xPosVal = _this.scale.x.invert(pos[0]).valueOf();
        } else {
          uniqueX = [...new Set(_this.vizData.map(d => d.x))].sort((a, b) => a - b);
          xPosVal = _this.scale.x.invert(pos[0]);
        }
        
        const yPosVal = _this.scale.y.invert(pos[1]);
        
        const ix1 = d3.bisectLeft(uniqueX, xPosVal, 1);
        const ix0 = ix1 - 1;
        const ix = xPosVal - uniqueX[ix0] > uniqueX[ix1] - xPosVal ? ix1 : ix0;
        const xValReal = uniqueX[ix]

        let data
        if(_this.binding.xType === 'T'){
          data = _this.vizData.filter(d => d.x.valueOf() === xValReal)
        }else{
          data = _this.vizData.filter(d => d.x === xValReal)
        }

        const yDist = data.map(d => Math.abs(d.y - yPosVal))
        const iy = yDist.indexOf(d3.min(yDist))
        const yKey = data[iy].color
        const yValReal = data[iy].y

        lines.style("opacity", d => (d.key === yKey ? 1 : 0.3));

        dot
          .transition()
          .duration(15)
          .attr(
            "transform",
            `translate(${_this.scale.x(xValReal)},${_this.scale.y(yValReal)})`
          );

        dot.select("text").text(_this.format.y(yValReal));
      }

      function left() {
        lines.transition().style("opacity", 1);

        dot.attr("display", "none");
      }
    },
    appendAnnotations: function() {
      if (this.annotations === null) {
        return;
      }

      const c = Vue.extend(AnnotationMarker);
      const _this = this;

      const m = d3
        .nest()
        .key(function(d) {
          return d.color;
        })
        .rollup(function(l) {
          return l.map(d => d.y);
        })
        .entries(this.vizData);

      this.annotations.forEach(function(a) {
        let d = m[a.subgroup];
        let instance = new c({
          propsData: {
            xPos: _this.scale.x(a.x),
            yPos: _this.scale.y(d["$" + a.x].y),
            text: a.text
          }
        });
        instance.$mount();
        _this.select.plotArea.node().appendChild(instance.$el);
      });
    },
    positionPlotElements: function() {
      const _this = this;

      const valueline = d3
        .line()
        .curve(d3.curveLinear)
        .x(d => this.scale.x(d.x))
        .y(d => this.scale.y(d.y));

      this.select.path.attr("d", d => valueline(d.value));
      this.select.lines.selectAll("text").attr("transform", function(d) {
        return (
          "translate(" +
          _this.scale.x(Math.max(...d.value.map(d => d.x)))*1.01 +
          "," +
          _this.scale.y(d.value.map(d => d.y).slice(-1)[0]) +
          ")"
        );
      });
    },
    updateAxes: function() {
      this.axis.x = d3.axisBottom(this.scale.x);

      this.axis.x
        .ticks(this.tick.frequency)
        .tickFormat(this.format.x);

      if (this.plotWidth < this.layout.yaxis.tickToRightThreshold) {
        this.axis.y = d3.axisRight(this.scale.y);
      } else {
        this.axis.y = d3.axisLeft(this.scale.y);
      }

      this.axis.y.tickFormat(this.format.y);

      this.select.xAxis.call(this.axis.x);
      this.select.yAxis.call(this.axis.y);
    },
    handleResize: function() {
      this.setScales();
      this.updateAxes();
      this.positionPlotElements();
    }
  },  

  mounted() {
    const _this = this;
    const _window = window;
    d3.csv(this.dataURL, d3.autoType).then(function(data) {
      // TODO: how can input parsing be handled for all x, y and color?
      _this.vizData = _this.transformData(data);
      _this.setReferences();
      _this.setDomain();
      _this.setScales();
      _this.appendPlotElements();
      _this.appendAnnotations();
      _this.positionPlotElements();
      _this.updateAxes();
      _this.setZoom();
      _window.addEventListener("resize", _this.handleResize);
    });
  }
};
