import React, { Component } from 'react';
import { LineChart } from 'react-easy-chart';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
import Options from '../Options/index';
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
class ResuseabelGraph extends Component {
  state = {
    data: []
  }
  componentDidMount = () => {
  setInterval(this.getData, 1000);
  }
  getData = () => {
    Data.getAll(this.props.userid, this.props.datatype).then(data => {
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
        layout={{  height: 700,
           yaxis:{range:this.state.yRange},xaxis:{ range: this.props.range, tickangle: -45, tickformat:this.props.tickType,tickcolor: '#000', autotick: true},title: this.props.title,}}
      />
        </div>
      </div>
    )
  }
} 
export default ResuseabelGraph;
