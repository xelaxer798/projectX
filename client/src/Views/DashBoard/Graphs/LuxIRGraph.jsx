import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
import moment from 'moment';
import 'moment-timezone';
import Constants from '../Constants/index';
import Images from '../../../Images/index';

class LuxIRGraph extends Component {
  state = {
    data: [],
    CurrentTime: moment().tz("America/Los_Angeles").format(),
    layout: {},
    loading: true,
    statusCode:'status code will appear here'
  };
  componentDidCatch = (error, info) => {
    console.log(error, 'hi im errors at lux')
    console.log(info, 'hi im info at lux')
  };
  componentDidMount = () => {

    let layout = {
      width: 575,
      height: 700,
      showlegend: true,
      margin: {
        // l: 50,
        // r: 50,
        // b: 100,
        // t: 100,
        pad: 4
      },

      legend: {
        x: 130,
        y: 30,
      },

      yaxis: { title: "Lux", },
      yaxis2: {
        title: "IR",
        titlefont: { color: "rgb(148, 103, 189)" },
        tickfont: { color: "rgb(148, 103, 189)" },
        overlaying: "y",
        side: "right"
      },
      xaxis: {
        tickfont: {
          family: 'Old Standard TT, serif',
          size: 12,
          color: 'black'
        }, ticks: 'outside', rangeselector: Constants.selectorOptions,
        rangeslider: {}, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      }, title: "Lux/Infrared"
    };

    this.setState({
      layout: layout
      //  tickFormat:'%I:%M %p'
    });
    setTimeout(this.getData, Constants.timeoutAndIntervalSettings.graphTimeout);
    setInterval(this.getData, Constants.timeoutAndIntervalSettings.graphUpdateInterval);
  };
  getData = async () => {
    let data = await Data.getAll(this.props.userid, 'Lux,IR');
    if (data.data !== null || data.data !== undefined || data.data !== []) {

      this.setState({
        data: data.data.luxIr,
        loading: false,
        statusCode: `Lux,IR Status Code: ${data.status}  `
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
export default LuxIRGraph;
