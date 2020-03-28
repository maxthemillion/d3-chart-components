import * as moment from "moment";
import * as d3 from 'd3'

export function loadData(opts){

    function convert (datum, type) {
        if (type === "Q" || type === "N" || type === 'P') {
          return datum;
        } else if (type === "T") {
          return moment(datum, 'YYYY-MM-DD');
        }
      }

    function transform (data) {
        // [ {color:A, x:v, y:v}, {color:A, x:v, y:v},  ...]
        const vizData = data.map(function(d) {
          return {
            x: convert(d[opts.binding.x], opts.binding.xType),
            y: convert(d[opts.binding.y], opts.binding.yType),
            color: convert(d[opts.binding.color], opts.binding.colorType)
          };
        });
        return vizData;
      }

    return d3.csv(opts.dataURL, d3.autoType).then(data => transform (data));
} 

