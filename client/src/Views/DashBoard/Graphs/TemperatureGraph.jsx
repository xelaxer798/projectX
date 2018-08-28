import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
class TestGraph extends Component {
  state = {
    data: []
  }
  componentDidMount = () => {
    
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
        layout={{ 
           yaxis:{range: [0,100]},xaxis:{  tickangle: -45, tickformat:'%I:%M %p',tickcolor: '#000', autotick: true},title: 'Temperature Graph'}}
      />
        </div>
      </div>
    )
  }
}
export default TestGraph;
