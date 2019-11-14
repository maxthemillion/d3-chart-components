import * as d3 from "d3";
import * as moment from "moment";

export default {
  name: "LinechartCore",
  props: {},
  data() {
    return {
      select: {},
      domain: { x: {}, y: {} },
      scale: {},
      rawData: {},
      vizData: {},
    };
  },
  watch: {},
  methods: {
    setReferences: function() {
      this.select.svg = d3.select(this.$refs.chartSVG);
      this.select.chartGroup = d3.select(this.$refs.chartGroup);
      this.select.xAxis = d3.select(this.$refs.xAxis);
      this.select.yAxis = d3.select(this.$refs.yAxis);
      this.select.plotArea = d3.select(this.$refs.plotArea);
      this.select.plotLegend = d3.select(this.$refs.plotLegend);
    },
    setDomain: function() {

      const _this = this;

      if(this.xDomain !== null){
        this.domain.y.max = d3.max(this.xDomain)
        this.domain.y.min = d3.min(this.xDomain)
      } else {
        this.domain.x.max = d3.max(this.rawData, d => d[_this.binding.x]);
        this.domain.x.min = d3.min(this.rawData, d => d[_this.binding.x]);
      }   

      if(this.yDomain !== null){
        this.domain.y.max = d3.max(this.yDomain)
        this.domain.y.min = d3.min(this.yDomain)
      }
      else if(this.yIncludeZero){
        this.domain.y.max = d3.max(this.rawData, d => Math.max(0, d[_this.binding.y]));
        this.domain.y.min = d3.min(this.rawData, d => Math.min(0, d[_this.binding.y]));
      } else {
        this.domain.y.max = d3.max(this.rawData, d => d[_this.binding.y]);
        this.domain.y.min = d3.min(this.rawData, d => d[_this.binding.y]);
      }      
    },
    setScales: function() {
      this.scale.x = d3
        .scaleTime()
        .range([0, this.select.svg.node().getBoundingClientRect().width])
        .domain([this.domain.x.min, this.domain.x.max]);

      this.scale.y = d3
        .scaleLinear()
        .range([this.select.svg.node().getBoundingClientRect().height, 0])
        .domain([this.domain.y.min, this.domain.y.max]);
    },
    drawPlot: function() {
      const _this = this;

      const color = d3.scaleOrdinal(this.colorScheme);

      const valueline = d3
        .line()
        .curve(d3.curveBasis)
        .x(d => _this.scale.x(d.x))
        .y(d => _this.scale.y(d.y));

      let g = this.select.plotArea
        .append("g")
        .selectAll("g")
        .data(this.vizData)
        .join("g");

      g.append("path")
        .attr("fill", "none")
        .attr("stroke", d => color(d[0].color))
        .attr("stroke-width", 1.5)
        .attr("d", valueline);
    },
    drawAxes: function(){
      this.select.xAxis.call(
        d3
          .axisBottom(this.scale.x)
          .ticks(d3.timeMonth.every(6))
          .tickFormat(d3.timeFormat("%d %B %y"))
      );

      this.select.yAxis.call(
        d3
          .axisLeft(this.scale.y)
      );
    },
    setUp: function() {
      this.setReferences();
      this.setDomain();
      this.setScales();
    },
    parseDateStrings: function(data) {
      const _this = this;
      data.forEach(function(d) {
        d[_this.binding.x] = moment(d[_this.binding.x], "MM/DD/YYYY");
      });
      return data;
    },
  },

  mounted() {
    const _this = this;
    d3.csv(this.dataURL, d3.autoType).then(function(data) {
      _this.rawData = _this.parseDateStrings(data);
      _this.vizData = _this.transformData(_this.rawData)
      _this.setUp();
      _this.drawPlot();
      _this.drawAxes();
    });
  }
};
