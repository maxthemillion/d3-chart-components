<template>
<g ref="annotations" >
    <circle 
        ref="circle"
        class="circle" 
        v-on:click="handleClick" 
        v-on:mouseover="handleMouseover" 
        v-on:mouseout="handleMouseout"
        :cx='xPos' 
        :cy='yPos' 
        r='5' 
        :fill='circleFillPassive' 
        :stroke='circleFillActive' 
        stroke-width='1.75' />
    <g ref="label" class='label'>
        <line 
            :x1="xPos" 
            :y1="yPos" 
            :y2='yPos + offset' 
            :x2='xPos' 
            height='50' 
            stroke='black' 
            stroke-width='1' 
            stroke-dasharray="3,3" 
            class='marker'/>
        <text 
            :y="yPos + offset + 5" 
            :x="xPos"
            fill='black'
            class='annotationText'>
            {{this.text}}
        </text>
    </g>
</g>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "AnnotationMarker",
  props: {
    xPos: Number,
    yPos: Number,
    text: String
  },
  data() {
    return {
      offset: 50,
      active: false,
      circleFillPassive: 'lightgray',
      circleFillActive: 'deepskyblue'
    };
  },
  methods: {
    handleMouseover: function() {
      d3
        .select(this.$refs.circle)
        .transition(500)
        .attr("fill", this.circleFillActive);
    },
    handleMouseout: function() {
      d3
        .select(this.$refs.circle)
        .transition(500)
        .attr("fill", this.circleFillPassive);
    },
    handleClick: function() {
      if (!this.active) {
        this.show();
      } else {
        this.hide();
      }
    },
    show: function() {
      d3
        .select(this.$refs.label)
        .transition(500)
        .style("opacity", 1);
      this.active = true;
    },
    hide: function() {
      d3
        .select(this.$refs.label)
        .transition(500)
        .style("opacity", 0)
        .attr("fill", this.circleFillPassive);
      this.active = false;
    }
  },
};
</script>

<style scoped>
.circle {
  opacity: 0.8;
}

.annotationText {
  font-size: x-small;
}

.label {
  opacity: 0;
}
</style>
