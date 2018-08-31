import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
import moment from 'moment';
import 'moment-timezone';
function min(value, ) {
  // const split = JSON.stringify(value);
  const dbDate = value.split(':')
  console.log(dbDate[1])

  const check0 = dbDate[1].split('');
  let temp;

  if (check0[0] === '0') {
    temp = '1' + check0[1]
    return JSON.parse(temp)
  } else {
    return JSON.parse(dbDate[1])
  }



}
class LuxIRGraph extends Component {
  state = {
    data: [],
    CurrentTime: moment().tz("America/Los_Angeles").format(),
    layout: {}
  }
  componentDidCatch=(error, info) =>{
    console.log(error,'hi im errors at lux')
    console.log(info,'hi im info at lux')
  }
  componentDidMount = () => {
    const selectorOptions = {
      buttons: [
        {
          step: 'hour',
          stepmode: 'backward',
          count: 1,
          label: '1h'
        }, {
          step: 'day',
          stepmode: 'backward',
          count: 1,
          label: '1d'
        }, {
          step: 'day',
          stepmode: 'backward',
          count: 7,
          label: '1w'
        }, {
          step: 'month',
          stepmode: 'backward',
          count: 1,
          label: '1m'
        }, {
          step: 'month',
          stepmode: 'backward',
          count: 6,
          label: '6m'
        }, {
          step: 'year',
          stepmode: 'todate',
          count: 1,
          label: 'YTD'
        }, {
          step: 'year',
          stepmode: 'backward',
          count: 1,
          label: '1y'
        }, {
          step: 'all',
          label: 'all'
        }],
    };
    let layout = {
      yaxis: { range: [0, 100000] }, xaxis: {
        tickfont: {
          family: 'Old Standard TT, serif',
          size: 12,
          color: 'black'
        }, ticks: 'outside', rangeselector: selectorOptions,
        rangeslider: {}, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      }, title: "Lux/Infrared"
    }

    this.setState({
      layout: layout
      //  tickFormat:'%I:%M %p'
    });
    setInterval(this.getData, 1000);
  }
  getData = () => {
    Data.getAll(this.props.userid, 'Lux,IR').then(data => {
      if (data.data !== null || data.data !== undefined || data.data !== []) {

        this.setState({
          data: data.data,
        })
      }
    })
  }
  render() {
    return (
      <div >
        <div style={{ paddingLeft: '10px', color: 'black' }}>

          <Plot

            data={this.state.data}
            layout={this.state.layout}
          />
        </div>
      </div>
    )
  }
}
export default LuxIRGraph;
