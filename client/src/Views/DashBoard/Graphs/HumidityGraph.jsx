import React, { Component } from 'react';
import { LineChart } from 'react-easy-chart';
import Data from '../../../Data/nodes-api';

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

function min(value,){
  // const split = JSON.stringify(value);
  const dbDate = value.split(':') 
  console.log( dbDate[1])
 
  const check0 =dbDate[1].split('');
let temp;

if(check0[0]==='0'){
  temp= '1'+check0[1]
  return JSON.parse(temp)
}else{
  return JSON.parse(dbDate[1])
}
 

 
}
class HumidityGraph extends Component {
  state = {
    data: []
  }
  componentDidMount = () => {
    setInterval(this.getData, 1000);
   

  }
getData=()=>{
  Data.getById(this.props.userid).then(data => {
    
    
          if (data.data !== null || data.data !== undefined || data.data !== []) {
            try {
              const luxArray = []
              for (let i = 0; i < data.data.length; i++) {
                let lux = {
    
                    x: data.data[i].currentTime  ,
                  y: JSON.parse(data.data[i].humidity
                  )
    
                }
                // console.log(lux)
                luxArray.push(lux)
              }
              const reversed =luxArray.reverse()
              this.setState({
                data: reversed,
    
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
          <h1> Humidity Graph</h1>
          <LineChart
            axes
            lineColors={['green']}
            xType={'text'}
            y2Type={"linear"}
            interpolate={'cardinal'}
            axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
            colorBars
            dataPoints
            grid
            yDomainRange={[0, 100]}
            barWidth={10}
            height={250}
            width={1000}
          
             data={[this.state.data]}

          />
        </div>
      </div>
    )

  }


} export default HumidityGraph ;
