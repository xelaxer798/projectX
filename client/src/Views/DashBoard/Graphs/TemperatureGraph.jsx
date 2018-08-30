import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
class TestGraph extends Component {
  state = {
    data: [],
    selectorOptions: {},
    layout: {}
  }
  componentDidMount = () => {
    const selectorOptions = {
      buttons: [
        {
          step: 'hour',
          stepmode: 'backward',
          count: 1,
          label: '1h'
        },  {
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
  let layout=  { 
      yaxis:{range: [0,100]},xaxis:{  tickfont: {
        family: 'Old Standard TT, serif',
        size: 12,
        color: 'black'
      },ticks: 'outside', rangeselector: selectorOptions,
        rangeslider: {}, tickangle: -45, tickformat:'%a %I:%M%p %e-%b',tickcolor: '#000', autotick: true},
        title: 'Temperature'
     }
    this.setState({
      selectorOptions: selectorOptions,
      layout: layout
    })
  setInterval(this.GetData, 1000);
  }
  GetData = () => {
    Data.getAll(this.props.userid, 'temperature').then(data => {
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
export default TestGraph;
