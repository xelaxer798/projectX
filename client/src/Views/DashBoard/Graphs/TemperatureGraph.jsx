import React, { Component } from 'react';
import { LineChart } from 'react-easy-chart';
import Data from '../../../Data/nodes-api';
class TemperatureGraph extends Component {
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
          data: data.data.Easy,
        })
      }
    })
  }
  render() {
    return (
      <div >
        <div style={{ paddingLeft: '10px', color: 'black' }}>
          <h1> Temperature Graph</h1>
          <LineChart
            axes
            xType={'text'}
            dataPoints
            interpolate={'cardinal'}
            y2Type="linear"
            axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
            colorBars
            grid
            lineColors={['green']}
            yDomainRange={[0, 125]}
            barWidth={10}
            height={250}
            width={1000}
            data={[this.state.data]}
          />
        </div>
      </div>
    )
  }
}
export default TemperatureGraph;
