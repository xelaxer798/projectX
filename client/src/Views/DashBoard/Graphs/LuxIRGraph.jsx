import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Plot from 'react-plotly.js';
import moment from 'moment';
import 'moment-timezone';
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
    CurrentTime :moment().tz("America/Los_Angeles").format(),
    timeToStartLuxIr:'',
    timeToEndLuxIr:''
  }
  componentDidMount = () => {
    const heyt=moment(this.state.CurrentTime).subtract(1, 'days');
  
      this.setState({
        timeToStartLuxIr:moment(heyt._d).tz("America/Los_Angeles").format('YYYY-MM-DD'),
        timeToEndLuxIr:moment(this.state.CurrentTime).format('YYYY-MM-DD'),
  //  tickFormat:'%I:%M %p'
      });
  setInterval(this.getData, 1000);
  }
  getData = () => {
    Data.getAll(this.props.userid, 'Lux,IR').then(data => {
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
           yaxis:{range: [0,100000]},xaxis:{  range:[this.state.timeToStartLuxIr,this.state.timeToEndLuxIr],tickangle: -45, tickformat:this.props.tickType,tickcolor: '#000', autotick: true},title: this.props.title,}}
      />
        </div>
      </div>
    )
  }
} 
export default LuxIRGraph;
