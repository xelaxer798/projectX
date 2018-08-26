import React, { Component } from 'react';
import { LineChart } from 'react-easy-chart';
import Data from '../../../Data/nodes-api';
import Button from '@material-ui/core/Button';
class RGBGraph extends Component {
  state = {
    data: []
  }
  componentDidMount = async () => {

    this.setInterval()
  }
  setInterval = () => {
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
          <h1> RGB Graph</h1>
          <Button>Last Hour</Button>
          <div >
            <LineChart
              axes
              lineColors={['red', 'green', 'blue']}
              xType={'text'}
              tickTimeDisplayFormat={"%H:%M:%S ."}
              xTicks={10}
              interpolate={'cardinal'}
              dataPoints
              style={{ '.label': { fill: 'black' }, paddingLeft: '10px' }}
              axisLabels={{ x: 'Time', y: 'Light Level' }}
              colorBars
              grid
              // xDomainRange={[`12:00 am`, `11:00 pm`]}
              yDomainRange={[1, 100000]}
              barWidth={10}
              height={250}
              width={1050}
              data={this.state.data}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default RGBGraph;
