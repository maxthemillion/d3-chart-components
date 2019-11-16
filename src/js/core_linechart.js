import * as d3 from "d3";
import * as moment from "moment";

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

      this.scale.x = d3
        .scaleTime()
        .range([0, this.select.svg.node().getBoundingClientRect().width])
        .domain([this.domain.x.min, this.domain.x.max]);

      this.scale.y = d3
        .scaleLinear()
        .range([this.select.svg.node().getBoundingClientRect().height, 0])
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
      const _this = this;

      this.select.lines = this.select.plotArea
        .append("g")
        .selectAll("g")
        .data(this.vizData)
        .join("g");

      this.select.path = this.select.lines.append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", d => this.color(d[0].color))
        .attr("stroke-width", 1.5)
        .on("mouseover", function (d) {
          _this.emphasize(d, this);
        })
        .on("mouseout", function () {
          _this.equalize();
        });
    },
    updateLine: function(){
      const _this = this;

      const valueline = d3
        .line()
        .curve(d3.curveBasis)
        .x(d => _this.scale.x(d.x))
        .y(d => _this.scale.y(d.y));

        this.select.path.attr("d", valueline)
    },
    updateAxes: function () {
      this.axis.x = d3
        .axisBottom(this.scale.x)
        .ticks(d3.timeMonth.every(6))
        .tickFormat(d3.timeFormat("%d %B %y"));

      this.axis.y = d3.axisLeft(this.scale.y)

      this.select.xAxis.call(this.axis.x);
      this.select.yAxis.call(this.axis.y);
    },
    setUp: function () {
      this.setReferences();
      this.setDomain();
      this.setScales();
    },
    parseDateStrings: function (data) {
      const _this = this;
      data.forEach(function (d) {
        d[_this.binding.x] = moment(d[_this.binding.x], "MM/DD/YYYY");
      });
      return data;
    },
    // eslint-disable-next-line no-unused-vars
    emphasize: function (_d, hoverNode) {
      d3.selectAll(".line").classed("passive", true);
      d3.select(hoverNode).classed("passive", false);
      d3.selectAll(".passive")
        .transition()
        .duration(500)
        .style("opacity", 0.1);
    },
    equalize: function () {
      d3.selectAll(".line")
        .classed("passive", false)
        .transition()
        .duration(500)
        .style("opacity", 1);
    },
    handleResize: function() {
      this.setScales();
      this.updateAxes();
      this.updateLine();
    }
  },

  mounted() {
    const _this = this;
    const _window = window;
    d3.csv(this.dataURL, d3.autoType).then(function (data) {
      _this.rawData = _this.parseDateStrings(data);
      _this.vizData = _this.transformData(_this.rawData);
      _this.setUp();
      _this.drawPlot();
      _this.updateLine();
      _this.updateAxes();
      _this.setZoom();
      _window.addEventListener('resize', _this.handleResize)
    });
  },
};
