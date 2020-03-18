import * as d3 from "d3";
import * as moment from "moment";
import Vue from 'vue'
import AnnotationMarker from '../components/AnnotationMarker.vue'

export default {
  name: "LinechartCore",
  props: {
    xDomain: {
      type: Array,
      default: function () {
        return null; //TODO: it doesn't work to set the xDomain yet. Seems to be some problem with scales
      }
    },
    yIncludeZero: {
      type: Boolean,
      default: true
    },
    yDomain: {
      type: Array,
      default: function () {
        return null;
      }
    },
    dataURL: String,
    binding: Object,
    colorScheme: {
      type: d3.colorScheme,
      default: function () {
        return d3.schemeBlues;
      }
    },
    annotations: {
      type: Array,
      default: function () {
        return null
      }
    }
  },
  data() {
    return {
      axis: {},
      select: {},
      domain: { x: {}, y: {} },
      scale: {},
      rawData: {},
      vizData: {},
      zoom: {}
    };
  },
  watch: {},
  methods: {
    setUp: function () {
      this.setReferences();
      this.setDomain();
      this.setScales();
    },
    setReferences: function () {
      this.select.svg = d3.select(this.$refs.chartSVG);
      this.select.chartGroup = d3.select(this.$refs.chartGroup);
      this.select.xAxis = d3.select(this.$refs.xAxis);
      this.select.yAxis = d3.select(this.$refs.yAxis);
      this.select.plotArea = d3.select(this.$refs.plotArea);
      this.select.plotLegend = d3.select(this.$refs.plotLegend);
    },
    setDomain: function () {
      const _this = this;

      if (this.xDomain !== null) {
        this.domain.y.max = d3.max(this.xDomain);
        this.domain.y.min = d3.min(this.xDomain);
      } else {
        this.domain.x.max = d3.max(this.rawData, d => d[_this.binding.x]);
        this.domain.x.min = d3.min(this.rawData, d => d[_this.binding.x]);
      }

      if (this.yDomain !== null) {
        this.domain.y.max = d3.max(this.yDomain);
        this.domain.y.min = d3.min(this.yDomain);
      } else if (this.yIncludeZero) {
        this.domain.y.max = d3.max(this.rawData, d =>
          Math.max(0, d[_this.binding.y])
        );
        this.domain.y.min = d3.min(this.rawData, d =>
          Math.min(0, d[_this.binding.y])
        );
      } else {
        this.domain.y.max = d3.max(this.rawData, d => d[_this.binding.y]);
        this.domain.y.min = d3.min(this.rawData, d => d[_this.binding.y]);
      }
    },
    setScales: function () {
      this.color = d3.scaleOrdinal(this.colorScheme);

      this.plotWidth = this.select.svg.node().getBoundingClientRect().width
      this.plotHeight = this.select.svg.node().getBoundingClientRect().height

      if(this.binding.xType === 'T'){
        this.scale.x = d3
          .scaleTime()
      }else if(this.binding.xType === 'Q'){
        this.scale.x = d3
          .scaleLinear()
      }

      this.scale.x = this.scale.x
        .range([0, this.plotWidth])
        .domain([this.domain.x.min, this.domain.x.max]);

      this.scale.y = d3
        .scaleLinear()
        .range([this.plotHeight, 0])
        .domain([this.domain.y.min, this.domain.y.max]);
    },
    setZoom() {
      this.zoom = d3
        .zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed);
      this.select.svg.call(this.zoom);

      const _this = this;

      function zoomed() {
        _this.select.plotArea.attr("transform", d3.event.transform);
        _this.select.xAxis.call(_this.axis.x.scale(d3.event.transform.rescaleX(_this.scale.x)));
        _this.select.yAxis.call(_this.axis.y.scale(d3.event.transform.rescaleY(_this.scale.y)));
      }
    },
    drawPlot: function () {
      const _this = this

      this.select.lines = this.select.plotArea
        .append("g")
        .selectAll("g")
        .data(this.vizData)
        .join("g");

      this.select.path = this.select.lines.append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", d => this.color(d[0].color))
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
      
      this.select.svg.call(_this.hover, _this.select.path)

    },
    hover(svg, path) {
      // Find example here: https://observablehq.com/@d3/multi-line-chart
      // TODO: highlight line that is closest to cursor
      if ("ontouchstart" in document) svg
          .style("-webkit-tap-highlight-color", "transparent")
          .on("touchstart", entered)
          .on("touchend", left)
      else svg
          .on("mouseenter", entered)
          .on("mouseleave", left);
      
      path.
        on("mouseover", function () {
          emphasize(this);
        })
        .on("mouseout", equalize);

      function entered() {
        d3.selectAll(".line")
          .transition()
          .style("opacity", 0.3);
      }
    
      function left() {
        d3.selectAll(".line")
          .transition()
          .style("opacity", 1);
        }

      function emphasize(hoverNode) {
        d3.select(hoverNode)
        .transition()
        .style("opacity", 1);
        }

      function equalize() {
        d3.selectAll(".line")
          .transition()
          .style("opacity", 0.3);
      }
    },
    appendAnnotations: function () {
      if (this.annotations === null) { return }

      const c = Vue.extend(AnnotationMarker)
      const _this = this

      const m = d3.map(this.vizData[0], d => d.x)
      // I index 0 here because the data is grouped in order to display multiple graphs in one chart
      // Future implementation should consider indexing by group name and providing a group to props
      // such that the annotations are bound to the correct group, not just the first one.

      this.annotations.forEach(function (a) {
        let instance = new c({ 
          propsData: { 
            xPos: _this.scale.x(a.x), 
            yPos: _this.scale.y(m['$'+a.x].y),
            text: a.text } })
        instance.$mount()
        _this.select.plotArea.node().appendChild(instance.$el)
      })
    },
    updateLine: function () {
      const _this = this;

      const valueline = d3
        .line()
        .curve(d3.curveLinear)
        .x(d => _this.scale.x(d.x))
        .y(d => _this.scale.y(d.y));

      this.select.path.attr("d", valueline)
    },
    updateAxes: function () {
      this.axis.x = d3
        .axisBottom(this.scale.x)
        .ticks(d3.timeMonth.every(6))
        .tickFormat(d3.timeFormat("%d %B %y"));

      if (this.plotWidth < 500) {
        this.axis.y = d3.axisRight(this.scale.y)
      } else {
        this.axis.y = d3.axisLeft(this.scale.y)
      }
      this.select.xAxis.call(this.axis.x);
      this.select.yAxis.call(this.axis.y);
    },
    parseDateStrings: function (data) {
      const _this = this;
      data.forEach(function (d) {
        d[_this.binding.x] = moment(d[_this.binding.x], "MM/DD/YYYY");
      });
      return data;
    },
    handleResize: function () {
      this.setScales();
      this.updateAxes();
      this.updateLine();
    }
  },

  mounted() {
    const _this = this;
    const _window = window;
    d3.csv(this.dataURL, d3.autoType).then(function (data) {
      if(_this.binding.xType==='T'){
        _this.rawData = _this.parseDateStrings(data)
      }else{
        _this.rawData = data
      }
      _this.vizData = _this.transformData(_this.rawData);
      _this.setUp();
      _this.drawPlot();
      _this.appendAnnotations();
      _this.updateLine();
      _this.updateAxes();
      _this.setZoom();
      _window.addEventListener('resize', _this.handleResize)
    });
  },
};
