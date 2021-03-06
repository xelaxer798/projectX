import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Button from '@material-ui/core/Button';
import Plot from 'react-plotly.js';
import moment from 'moment';
import 'moment-timezone';
import Constants from '../Constants/index';
import Images from '../../../Images/index';
class RGBGraph extends Component {
  state = {
    data: [],
    selectorOptions: {},
    layout: {},
    loading: true,
    statusCode:'status code will appear here'
  };
  componentDidCatch = (error, info) => {
    console.log('hi i am catching RGB')
    console.log(error, 'hi im errors at RGB')
    console.log(info, 'hi im info at RGB')
  };

  componentDidMount = async () => {

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
      yaxis: { fixedrange: true, range: [0, 100000] },
      xaxis: {
        tickfont: {
          family: 'Old Standard TT, serif',
          size: 12,
          color: 'black'
        },
        ticks: 'outside',
        rangeselector: Constants.selectorOptions,
        rangeslider: {}, autoRange: true, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      }, title: 'RGB '
    };
    this.setState({

      selectorOptions: Constants.selectorOptions,
      layout: layout
      //  tickFormat:'%I:%M %p'
    });
    setTimeout(this.getData, Constants.timeoutAndIntervalSettings.graphTimeout);
    setInterval(this.getData, Constants.timeoutAndIntervalSettings.graphUpdateInterval);

  };

  getData = async () => {
    let data = await Data.getAll(this.props.userid, 'RGB')
    if (data.data !== null || data.data !== undefined || data.data !== []) {
      this.setState({
        data: data.data.RGB,
        loading: false,
        statusCode:`RGB Status Code: ${data.status}  `
      });
    };

  };

  render() {

    return (
      <div >
        <div style={{ paddingLeft: '10px', color: 'black' }}>
          <div >
            {this.state.statusCode}
            {!this.state.loading ? <Plot

              data={this.state.data}
              layout={this.state.layout}
            /> : <div>

                <img src={Images.loadingGif} alt='loading' />
              </div>}

          </div>
        </div>
      </div>
    );
  };
};
export default RGBGraph;
