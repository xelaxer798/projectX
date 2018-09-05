import React, { Component } from 'react';
import { LineChart } from 'react-easy-chart';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
import Options from '../Options/index';
import Images from '../../../Images/index';

class HumidityGraph extends Component {
  state = {
    data: [],
    selectorOptions: {},
    layout: {},
    loading: true,
    statusCode: 'status code will appear here'
  };
  componentDidCatch = (error, info) => {
    console.log('hi i am catching Humidity');
    console.log(error, 'hi im errors at hum');
    console.log(info, 'hi im info at hum');
  };
  componentDidMount = () => {

    let layout = {
      width: 575,
      height: 700,
      margin: {
        // l: 50,
        // r: 50,
        // b: 100,
        // t: 100,
        pad: 4
      },
      yaxis: { range: [0, 100] }, xaxis: {
        tickfont: {
          family: 'Old Standard TT, serif',
          size: 12,
          color: 'black'
        },
        ticks: 'outside', rangeselector: Options.selectorOptions, rangeslider: {},
        tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      }, title: 'Humidity'
    };

    this.setState({
      selectorOptions: Options.selectorOptions,
      layout: layout
    });
    setTimeout(this.GetData, 3000);
    setInterval(this.getData, 32000);
  };
  getData = async () => {
    let data = await Data.getAll(this.props.userid, 'humidity');
    if (data.data !== null || data.data !== undefined || data.data !== []) {
      this.setState({
        data: data.data.humidity,
        loading: false,
        statusCode:`Humidity Status code: ${data.status}  `
      });
    };

  };
  render() {
    return (
      <div >
        <div style={{ paddingLeft: '10px', color: 'black' }}>
          {this.state.statusCode}
          {!this.state.loading ? <Plot

            data={this.state.data}
            layout={this.state.layout}
          /> : <div>

              <img src={Images.loadingGif} alt='loading' />
            </div>}
        </div>
      </div>
    );
  };
};
export default HumidityGraph;
