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
    loading:true
  }
  componentDidCatch = (error, info) => {
    console.log('hi i am catching Temperature');
    console.log(error, 'hi im errors at Temp');
    console.log(info, 'hi im info at Temp');
  };
  componentDidMount = () => {

    let layout = {
      height: 700,
      yaxis: { range: [0, 100] }, xaxis: {
        tickfont: {
          family: 'Old Standard TT, serif',
          size: 12,
          color: 'black'
        }, ticks: 'outside', rangeselector: Options.selectorOptions,
        rangeslider: {}, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
      },
      title: 'Temperature'
    }
    this.setState({
      selectorOptions: Options.selectorOptions,
      layout: layout
    })

    setInterval(this.GetData, 1000);
  }
  GetData = async() => {
 let data=await   Data.getAll(this.props.userid, 'temperature')
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
<h1>Your Graphs are Loading</h1>
  <img src={Images.loadingGif} alt='loading'/>
  </div>}
        
        </div>
      </div>
    )
  }
}
export default TestGraph;
