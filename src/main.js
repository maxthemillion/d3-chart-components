import Vue from 'vue'
import App from './App.vue'
import * as moment from 'moment'
import * as d3 from "d3"


Vue.config.productionTip = false

let opts = {
  dataURL: "./data/approval_allpolls.csv",
  chartTitle: "How unpopular is the US president?",
  chartSubTitle: "Share of respondents disapproving the president (in %)",
  commentTitle: "The unwanted president",
  comment: "Disapproval among Voters increased sharply right after his inauguration but levelled off at a stable 50-55 percent shortly after.",
  binding:  { x: "modeldate", y: "disapprove_estimate", color: "subgroup"},
  xAxisTitle: "Time in office",
  yAxisTitle: null,
  colorScheme: d3.schemeTableau10,
  annotations: [
    {x: moment('2017-05-09'), text:'Trump fires James Comey'},
    {x: moment('2017-05-31'), text:'Trump tweets "covfefe"'},
    {x: moment('2017-10-04'), text:'Trump throws paper towel at Puerto Ricans'},
    {x: moment('2019-09-01'), text:'Trump fires ambassador to Ukraine'},
  ]
}

new Vue({
  render: h => h(App, {props:{ opts: opts}}),
}).$mount('#app')
