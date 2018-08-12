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
class RGBGraph extends Component {
  state = {
    R: [],
    G:[],
    B:[],
    data:[]
  }
  componentDidMount = () => {
    setInterval(this.getData, 1000);
   

  }
getData=()=>{
  Data.getById(this.props.userid).then(data => {
    console.log(data.data)
    
          if (data.data !== null || data.data !== undefined || data.data !== []) {
            try {
              const rArray = [];
              for (let i = 0; i < data.data.length; i++) {
                let R = {
    
                    x: data.data[i].currentTime  ,
                  y: JSON.parse(data.data[i].r
                  )
    
                }
                // console.log(R)
                rArray.push(R)
              }
              const gArray = [];
              for (let i = 0; i < data.data.length; i++) {
                let G = {
    
                    x: data.data[i].currentTime  ,
                  y: JSON.parse(data.data[i].g)
    
                }
                // console.log(G)
                gArray.push(G)
              }
              const bArray = [];
              for (let i = 0; i < data.data.length; i++) {
                let B = {
    
                    x: data.data[i].currentTime  ,
                  y: JSON.parse(data.data[i].b )
    
                }
                // console.log(B)
                bArray.push(B)
              }
              const reverseR=rArray.reverse();
              const reverseG =gArray.reverse()
              const reverseB =bArray.reverse()
              const thedata=[reverseR,reverseG,reverseB]
              console.log(thedata)
           
              this.setState({
                R: reverseR,
                G:reverseG,
                B:reverseB,
                data:thedata
    
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
          <LineChart
            axes
            lineColors={['red','green','blue']}
            xType={'text'}
            // y2Type="linear"
            interpolate={'cardinal'}
            dataPoints
         
            y2Type="linear"
            axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
            colorBars
            grid
            yDomainRange={[1, 100000]}
            barWidth={10}
            height={250}
            width={750}
          
             data={this.state.data}

          />
        </div>
      </div>
    )

  }


} export default RGBGraph ;
