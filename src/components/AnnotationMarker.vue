<template>
<g ref="annotations" >
    <line :x1="xPos" :y1="yPos" :y2='yPos + offset' :x2='xPos' height='50' fill='white' stroke='black' stroke-width='1' stroke-dasharray="3,3" class='marker'/>
    <text :y="yPos + offset + 5" :x="xPos" class='annotationText'>{{this.text}}</text>
</g>
</template>

<script>
export default {
    name: "AnnotationMarker",
    props: {
        xPos: Number,
        yPos: Number,
        text: String
    },
    data() {
        return {
            offset: 50
        }
    }
}
</script>

<style scoped>
.marker{
    fill: white;
}

.annotationText{
    font-size: x-small;
}

</style>
