import React, { Component } from 'react';
import { LineChart } from 'react-easy-chart';
import Data from '../../../Data/nodes-api';
import Button from '@material-ui/core/Button';
function getDbDate(value) {
  const split = JSON.stringify(value);
  const dbDate = split.split(':')
  const splitDate = dbDate[0].split('-')
  const dayCreated = splitDate[2].split('T')
  const removed = splitDate[0].split('"')
  console.log(dbDate)
  const dates = splitDate[1] + '-' + dayCreated[0] + '-' + removed[1] + ' ' + dbDate[1]
  console.log(typeof dates)
  return dates
};

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
class RGBGraph extends Component {

  state = {

    data: []
  }
  componentDidMount = () => {
    setInterval(this.getData, 1000);


  }
  lastHour=()=>{

  }
  getData = () => {
    Data.getById(this.props.userid).then(data => {
      if (data.data !== null || data.data !== undefined || data.data !== []) {
        console.log(data.data)
        try {
          const rArray = [];
          for (let i = 0; i < data.data.length; i++) {
            let R = {
              x: data.data[i].currentTime,
              y: JSON.parse(data.data[i].r
              )
            }
            rArray.push(R)
          }
          const gArray = [];
          for (let i = 0; i < data.data.length; i++) {
            let G = {
              x: data.data[i].currentTime,
              y: JSON.parse(data.data[i].g)
            }
            gArray.push(G)
          }
          const bArray = [];
          for (let i = 0; i < data.data.length; i++) {
            let B = {
              x: data.data[i].currentTime,
              y: JSON.parse(data.data[i].b)
            }
            bArray.push(B)
          }
          const reverseR = rArray.reverse();
          const reverseG = gArray.reverse()
          const reverseB = bArray.reverse()
          // const test=[{x:'12:00 am'},{x:'10:00 am'},{x:'12:00 pm'},{x:'5:00 pm'},{x:'11:59 pm'}]
          const thedata = [reverseR, reverseG, reverseB]
          this.setState({
            data: thedata
          })
        } catch (err) {
          console.log(err)
        }
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
            tickTimeDisplayFormat={'"%H:%M:%S"'}
            xTicks={10}
          
        
            interpolate={'cardinal'}
            dataPoints
            style={{ '.label': { fill: 'black' },paddingLeft: '10px' }}
            axisLabels={{x: 'Time', y: 'Light Level'}}
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


} export default RGBGraph;
