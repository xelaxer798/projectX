import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Button from '@material-ui/core/Button';
import Plot from 'react-plotly.js';
import moment from 'moment';
import 'moment-timezone';

class RGBGraph extends Component {
  state = {
    data: [],
    CurrentTime: moment().tz("America/Los_Angeles").format(),
    timeToStartRGB: '',
    timeToEndRGB: '',
    selectorOptions: {},
    layout: {}
  }
  componentDidCatch=(error, info) =>{
    console.log(error,'hi im errors')
    console.log(info,'hi im info')
  }
  componentDidMount = async () => {
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
    const heyt = moment(this.state.CurrentTime).subtract(1, 'days');
    let layout = {
      yaxis: { fixedrange: true, range: [0, 100000] }, 
      xaxis: {tickfont: {
        family: 'Old Standard TT, serif',
        size: 12,
        color: 'black'
      },
      ticks: 'outside',
        rangeselector: selectorOptions,
        rangeslider: {}, autoRange: true, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      }, title: 'RGB '
    }
    this.setState({
      timeToStartRGB: moment(heyt._d).tz("America/Los_Angeles").format('YYYY-MM-DD'),
      timeToEndRGB: moment(this.state.CurrentTime).format('YYYY-MM-DD'),
      selectorOptions: selectorOptions,
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
