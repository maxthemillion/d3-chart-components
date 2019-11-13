import * as d3 from "d3";
import * as moment from "moment";
import rough from "roughjs/dist/rough.umd";

export default {
  name: "LinechartCore",
  props: {},
  data() {
    return {
      select: {},
      domain: { x: {}, y: {} },
      scale: {},
      data: {},
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
    },
    setDomain: function() {
      const _this = this;
      this.domain.x.max = d3.max(this.data, d => d[_this.binding.x]);
      this.domain.x.min = d3.min(this.data, d => d[_this.binding.x]);

      this.domain.y.max = d3.max(this.data, d => d[_this.binding.y]);
      this.domain.y.min = d3.min(this.data, d => d[_this.binding.y]);
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
    draw: function() {
      const _this = this;
      const rc = rough.svg(this.select.svg.node());
      const valueline = d3
        .line()
        .x(d => _this.scale.x(d[_this.binding.x]))
        .y(d => _this.scale.y(d[_this.binding.y]));

      let nestedData = d3
        .nest()
        .key(function(d) {
          return d[_this.binding.color];
        })
        .map(this.data);
      
      let color = d3.scaleOrdinal(this.colorScheme);

      nestedData.keys().forEach(function(item){ 
        let rPath = rc.path(valueline(nestedData['$'+item]), { simplification: 0.03, stroke: color(item)});
        _this.select.svg.node().appendChild(rPath)
      })
  
      this.select.xAxis.call(
        d3
          .axisBottom(this.scale.x)
          .ticks(d3.timeMonth.every(6))
          .tickFormat(d3.timeFormat("%d %B %y"))
      );

      this.select.yAxis.call(
        d3
          .axisLeft(this.scale.y)
          .tickValues([
            d3.min(this.data, d => d[this.binding.y]),
            d3.max(this.data, d => d[this.binding.y])
          ])
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
    }
  },

  mounted() {
    const _this = this;
    d3.csv(this.dataURL, d3.autoType).then(function(data) {
      _this.data = _this.parseDateStrings(data);
      _this.setUp();
      _this.draw();
    });
  }
};
