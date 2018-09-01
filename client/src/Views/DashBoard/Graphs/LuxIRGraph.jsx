import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
import moment from 'moment';
import 'moment-timezone';
import Options from '../Options/index';
import Images from '../../../Images/index';
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
    layout: {},
    loading:true
  }
  componentDidCatch=(error, info) =>{
    console.log(error,'hi im errors at lux')
    console.log(info,'hi im info at lux')
  }
  componentDidMount = () => {
  
    let layout = {
      height: 700,
      yaxis: { range: [0, 100000] }, xaxis: {
        tickfont: {
          family: 'Old Standard TT, serif',
          size: 12,
          color: 'black'
        }, ticks: 'outside', rangeselector: Options.selectorOptions,
        rangeslider: {}, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      }, title: "Lux/Infrared"
    }

    this.setState({
      layout: layout
      //  tickFormat:'%I:%M %p'
    });
    setInterval(this.getData, 1000);
  }
  getData =async () => {
  let data=await  Data.getAll(this.props.userid, 'Lux,IR')
      if (data.data !== null || data.data !== undefined || data.data !== []) {

        this.setState({
          data: data.data,
          loading:false
        })
      }
   
  }
  render() {
    return (
      <div >
        <div style={{ paddingLeft: '10px', color: 'black' }}>

              {!this.state.loading?  <Plot

data={this.state.data}
layout={this.state.layout}
/>:<div>

  <img src={Images.loadingGif} alt='loading'/>
  </div>}
        </div>
      </div>
    )
  }
}
export default LuxIRGraph;
