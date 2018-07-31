import React,{Component} from 'react';
import {BarChart} from 'react-easy-chart';
import Data from '../../Data/nodes-api';

function getDbDate (value) {
  const split=JSON.stringify(value);
const dbDate = split.split(':')
const splitDate=dbDate[0].split('-')
const dayCreated =splitDate[2].split('T')
const removed=splitDate[0].split('"')
console.log(dbDate)
const dates=splitDate[1]+'-'+dayCreated[0]+'-'+removed[1] +' ' +dbDate[1]
console.log(dates)
return dates
 };
class Dashboard extends Component {
    state={
      data:[]
    }
    componentDidMount = () => {

      Data.getById().then(data => {
     
     if(data.data!==null||data.data !==undefined||data.data !==[]){
       try{
      const  luxArray=[]
         for(let i=0;i<data.data.length;i++){
           let lux={

            x: getDbDate(data.data[i].createdAt),
          y:  data.data[i].lux

           }
        luxArray.push(lux)
         }
console.log(luxArray)
        this.setState({
          data:luxArray,
         
        })
       }catch (err){
         console.log(err)
       }
     
     }
  
      })
      
    }
    
    render(){
      return(
        <div className='home' style={{backgroundColor:'white'}}>
  
This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}

<div style={{paddingLeft:'10px',color:'black'}}>

 <BarChart
    axes
    interpolate={'cardinal'}
    y2Type="linear"
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    colorBars
    grid
    barWidth={10}
    width={1000}
    data={this.state.data}
  />
</div>
      </div>
      )
    
    }
  
  
  }export default Dashboard;
  