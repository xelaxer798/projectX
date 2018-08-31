import React, { Component } from 'react';
import { LineChart } from 'react-easy-chart';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
import Options from '../Options/index';
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
class HumidityGraph extends Component {
  state = {
    data: [],
    selectorOptions: {},
    layout: {}
  }
  componentDidCatch = (error, info) => {
    console.log('hi i am catching Humidity');
    console.log(error, 'hi im errors at hum');
    console.log(info, 'hi im info at hum');
  };
  componentDidMount = () => {

    let layout = {
      height: 700,
      yaxis: { range: [0, 100] }, xaxis: {
        tickfont: {
          family: 'Old Standard TT, serif',
          size: 12,
          color: 'black'
        },
        ticks: 'outside', rangeselector: Options.selectorOptions, rangeslider: {},
        tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      }, title: 'Humidity'
    }

    this.setState({
      selectorOptions: Options.selectorOptions,
      layout: layout
    })
    setInterval(this.getData, 1000);
  }
  getData = () => {
    Data.getAll(this.props.userid, 'humidity').then(data => {
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
export default HumidityGraph;
