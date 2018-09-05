import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
import Options from '../Options/index';
import Images from '../../../Images/index';
class TestGraph extends Component {
  state = {
    data: [],
    selectorOptions: {},
    layout: {},
    loading: true,
    statusCode:'status code will appear here'
  };
  componentDidCatch = (error, info) => {
    console.log('hi i am catching Temperature');
    console.log(error, 'hi im errors at Temp');
    console.log(info, 'hi im info at Temp');
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
        pad: 1
      },
      yaxis: { range: [0, 125] }, xaxis: {
        tickfont: {
          family: 'Old Standard TT, serif',
          size: 12,
          color: 'black'
        }, ticks: 'outside', rangeselector: Options.selectorOptions,
        rangeslider: {}, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      },
      title: 'Temperature'
    };
    this.setState({
      selectorOptions: Options.selectorOptions,
      layout: layout
    });
setTimeout(this.GetData, 2000)
    setInterval(this.GetData, 30000);
  };
  GetData = async () => {
    let data = await Data.getAll(this.props.userid, 'temperature');
   
    if (data.data !== null || data.data !== undefined || data.data !== []) {
      this.setState({
        data: data.data.temperature,
        loading: false,
        statusCode:`Temperature Status Code: ${data.status}  `
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
              <h1>Your Graphs are Loading</h1>
              <img src={Images.loadingGif} alt='loading' />
            </div>}

        </div>
      </div>
    );
  };
};
export default TestGraph;
