import Vue from 'vue'
import App from './App.vue'
import * as moment from 'moment'
import * as d3 from "d3"
import {loadData} from "./js/utils/dataLoad.js"


Vue.config.productionTip = false

// eslint-disable-next-line no-unused-vars  
let opts_timeX = {
  dataURL: "./data/all_sel.csv",
  chartTitle: "Are countries undertesting?",
  chartSubTitle: "Share of deaths in confirmed COVID-19 cases",
  commentTitle: "Vast differences in testing procedures",
  comment: "While Germany and South Korea have very low numbers of deaths in confirmed cases, Italy and originally also the US did not. Assuming (almost) equal standards in health treatment across these industrialized countries, the figures may be an indicator on whether countries are undertesting.",
  binding:  { 
    x: "date", 
    xType:'T', 
    y: "death_rate", 
    yType:'P',
    color: "country",
    colorType:"N"
  },
  format:{
    y: d3.format('.1%'), 
    x: d3.timeFormat("%d %B")
  },
  tick:{
    frequency: d3.timeWeek.every(1)
  },
  scale:{
    x: d3.scaleTime(),
    y: d3.scaleLinear(),
    color: d3.scaleOrdinal()
  },
  xAxisTitle: "Days since 100th case",
  yAxisTitle: null,
  colorScheme: ['steelblue'],
  colorHighlight: ['Germany', 'Italy'],
  annotations: []
}

// eslint-disable-next-line no-unused-vars  
let opts_quantitativeX = {
  dataURL: "./data/all_sel.csv",
  chartTitle: "Are countries undertesting?",
  chartSubTitle: "Share of deaths in confirmed COVID-19 cases",
  commentTitle: "Vast differences in testing procedures",
  comment: "While Germany and South Korea have very low numbers of deaths in confirmed cases, Italy and originally also the US did not. Assuming (almost) equal standards in health treatment across these industrialized countries, the figures may be an indicator on whether countries are undertesting.",
  binding:  { 
    x: "days_since100", 
    xType:'Q', 
    y: "death_rate", 
    yType:'P',
    color: "country",
    colorType:"N"
  },
  format:{
    y: d3.format('.1%')
  },
  xAxisTitle: "Days since 100th case",
  yAxisTitle: null,
  colorScheme: ['steelblue'],
  colorHighlight: ['Germany', 'Italy'],
  annotations: []
}

// eslint-disable-next-line no-unused-vars
let opts_dateX = {
  dataURL: "./data/approval_allpolls.csv",
  chartTitle: "How unpopular is the US president?",
  chartSubTitle: "Share of respondents disapproving the president (in %)",
  commentTitle: "The unwanted president",
  comment: "Disapproval among Voters increased sharply right after his inauguration but levelled off at a stable 50-55 percent shortly after.",
  binding:  { 
    x: "modeldate", 
    xType: "T",
    y: "disapprove_estimate",
    yType: "Q", 
    color: "subgroup",
    colorType: "N"
  },
  xAxisTitle: "Time in office",
  yAxisTitle: null,
  colorScheme: d3.schemeTableau10,
  annotations: [
    {x: moment('2017-05-09'), text:'Trump fires James Comey', subgroup: null},
    {x: moment('2017-05-31'), text:'Trump tweets "covfefe"', subgroup: null},
    {x: moment('2017-10-04'), text:'Trump throws paper towel at Puerto Ricans', subgroup: null},
    {x: moment('2019-09-01'), text:'Trump fires ambassador to Ukraine', subgroup: null},
  ]
}


let opts = opts_timeX
loadData(opts).then(function(data){
  opts.vizData = data 
  new Vue({
    render: h => h(App, {props:{ opts: opts}}),
  }).$mount('#app')

}
)

