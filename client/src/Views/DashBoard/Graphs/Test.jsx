import React, { Component } from 'react';
import { LineChart } from 'react-easy-chart';
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
          console.log(data)
         
        this.setState({
          data: data.data.Ploty,
        })
      }
    })
  }
  render() {
    return (
      <div >
        <div style={{ paddingLeft: '10px', color: 'black' }}>
          <h1> Test Graph</h1>
          <Plot
          color={'blue'}
        data={this.state.data}
        layout={{ 
           yaxis:{range: [0,100]},xaxis:{ tickformat:'%I:%M %p',tickcolor: '#000', autotick: true},title: 'A Fancy Plot',}}
      />
        </div>
      </div>
    )
  }
}
export default TestGraph;
