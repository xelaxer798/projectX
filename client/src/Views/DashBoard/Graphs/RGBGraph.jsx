import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Button from '@material-ui/core/Button';
import Plot from 'react-plotly.js';
import moment from 'moment';
import 'moment-timezone';
import Options from '../Options/index';
import Images from '../../../Images/index';
class RGBGraph extends Component {
  state = {
    data: [],
    selectorOptions: {},
    layout: {},
    loading:true
  };
  componentDidCatch=(error, info) =>{
    console.log('hi i am catching RGB')
    console.log(error,'hi im errors at RGB')
    console.log(info,'hi im info at RGB')
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
      xaxis: {tickfont: {
        family: 'Old Standard TT, serif',
        size: 12,
        color: 'black'
      },
      ticks: 'outside',
        rangeselector:  Options.selectorOptions,
        rangeslider: {}, autoRange: true, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      }, title: 'RGB '
    };
    this.setState({

      selectorOptions:  Options.selectorOptions,
      layout: layout
      //  tickFormat:'%I:%M %p'
    });
    setInterval(this.getData, 7000);

  };

  getData =async () => {
  let data=await  Data.getAll(this.props.userid, 'RGB')
      if (data.data !== null || data.data !== undefined || data.data !== []) {
        this.setState({
          data: data.data,
          loading:false
        });
      };
   
  };

  render() {

    return (
      <div >
        <div style={{ paddingLeft: '10px', color: 'black' }}>
          <div >
          {!this.state.loading?  <Plot

data={this.state.data}
layout={this.state.layout}
/>:<div>

  <img src={Images.loadingGif} alt='loading'/>
  </div>}

          </div>
        </div>
      </div>
    );
  };
};
export default RGBGraph;
