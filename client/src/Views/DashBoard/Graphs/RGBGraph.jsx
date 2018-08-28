import React, { Component } from 'react';
import Data from '../../../Data/nodes-api';
import Button from '@material-ui/core/Button';
import Plot from 'react-plotly.js';
import moment from 'moment';
import 'moment-timezone';
class RGBGraph extends Component {
  state = {
    data: [],
    CurrentTime :moment().tz("America/Los_Angeles").format(),
    timeToStartRGB:'',
    timeToEndRGB:''
  }
  componentDidMount = async () => {
    const heyt=moment(this.state.CurrentTime).subtract(1, 'days');
  
      this.setState({
    timeToStartRGB:moment(heyt._d).tz("America/Los_Angeles").format('YYYY-MM-DD'),
   timeToEndRGB:moment(this.state.CurrentTime).format('YYYY-MM-DD'),
  //  tickFormat:'%I:%M %p'
      });
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
           yaxis:{range: [0,100000]},xaxis:{ range:[this.state.timeToStartRGB,this.state.timeToEndRGB], tickangle: -45, tickformat:'%I:%M %p',tickcolor: '#000', autotick: true},title: 'RGB Graph'}}
      />
          </div>
        </div>
      </div>
    )
  }
}
export default RGBGraph;
