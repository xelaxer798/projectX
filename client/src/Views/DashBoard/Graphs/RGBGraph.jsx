import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Button from '@material-ui/core/Button';
import Plot from 'react-plotly.js';
class RGBGraph extends Component {
  state = {
    data: []
  }
  componentDidMount = async () => {

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
        layout={{ 
           yaxis:{range: [0,100000]},xaxis:{  tickangle: -45, tickformat:'%I:%M %p',tickcolor: '#000', autotick: true},title: 'RGB Graph'}}
      />
          </div>
        </div>
      </div>
    )
  }
}
export default RGBGraph;
