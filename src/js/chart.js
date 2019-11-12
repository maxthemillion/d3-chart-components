import * as d3 from "d3";

export default {
  name: "Chart",
  props: {
    data: {}
  },

  data() {
    return {
      select: {},
      domain: {}
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
      this.domain.max = d3.max(this.data, d => d.value);
      this.domain.min = d3.min(this.data, d => Math.min(d.value, 0));
    },
    draw: function() {
      const _this = this;

      this.x = d3
        .scaleTime()
        .range([0, this.select.svg.node().getBoundingClientRect().width])
        .domain([this.minDate, this.maxDate]);

      this.y = d3
        .scaleLinear()
        .range([this.select.svg.node().getBoundingClientRect().height, 0])
        .domain([0, 1]); //TODO: adjust domain

      const valueline = d3
        .line()
        .x(d => _this.x(d.date))
        .y(d => _this.y(d.num));

      this.select.plotArea
        .append("path")
        .attr("class", "chartLine")
        .attr("d", valueline(this.data)); //TODO: adjust data

      this.select.xAxis.call(
        d3
          .axisBottom(this.x)
          .ticks(d3.timeMonth.every(6))
          .tickFormat(d3.timeFormat("%d %B %y"))
      );

      this.select.yAxis.call(
        d3.axisLeft(this.y).tickValues([
          d3.min(this.data, d => d.num), //TODO: adjust data
          d3.max(this.data, d => d.num) //TODO: adjust data
        ])
      );
    }
  },

  mounted() {
    this.setReferences();
    this.draw();
  }
};
