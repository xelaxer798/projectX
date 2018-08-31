import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Button from '@material-ui/core/Button';
import Plot from 'react-plotly.js';
import moment from 'moment';
import 'moment-timezone';
import Options from '../Options/index';
class RGBGraph extends Component {
  state = {
    data: [],
    selectorOptions: {},
    layout: {}
  }
  componentDidCatch=(error, info) =>{
    console.log('hi i am catching RGB')
    console.log(error,'hi im errors at RGB')
    console.log(info,'hi im info at RGB')
  }

  componentDidMount = async () => {
  
    let layout = {
      height: 700,
      yaxis: { fixedrange: true, range: [0, 100000] }, 
      xaxis: {tickfont: {
        family: 'Old Standard TT, serif',
        size: 12,
        color: 'black'
      },
      ticks: 'outside',
        rangeselector:  Options.selectorOptions,
        rangeslider: {}, autoRange: true, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      }, title: 'RGB '
    }
    this.setState({

      selectorOptions:  Options.selectorOptions,
      layout: layout
      //  tickFormat:'%I:%M %p'
    });
    setInterval(this.getData, 1000);

  }

  getData = () => {
    Data.getAll(this.props.userid, 'RGB').then(data => {
      if (data.data !== null || data.data !== undefined || data.data !== []) {
        this.setState({
          data: data.data
        })
      }
    })
  }

  render() {

    return (
      <div >
        <div style={{ paddingLeft: '10px', color: 'black' }}>
          <div >
            <Plot
              color={'blue'}
              data={this.state.data}

              layout={this.state.layout}
            />

          </div>
        </div>
      </div>
    )
  }
}
export default RGBGraph;
