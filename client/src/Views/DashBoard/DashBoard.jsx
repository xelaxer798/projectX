import React, { Component } from 'react';
import TemperatureGraph from './Graphs/TemperatureGraph'
import HumidityGraph from './Graphs/HumidityGraph'
import moment from 'moment';
import RGB from './Graphs/RGBGraph'
import Button from '@material-ui/core/Button';
import DataCard from './Cards/DataCard';
import Temp from './Cards/TempDataCard';
import Data from '../../Data/nodes-api';
class Dashboard extends Component {
  state={
    r:0,
    g:0,
    b:0,
    time:'',
    getWarnings:[],
    userId:''
            }
  componentDidMount = () => {
  
    setInterval(this.getWarnings, 1000);
  }
  
  deleteAllUserNodes=()=>{
    let yesOrNo=  window.confirm(`Are You Sure you want to Delete this users node data with a user Id of ${this.props.userId}!?!`);
    if(yesOrNo ===true){
      Data.delete(this.props.userId)
    }
    

  }
getWarnings=()=>{
  
  Data.getWarnings(this.props.userId).then(data => {
  
    const mywarnings=[];
 
    for(let i=0;i<data.data.length;i++){
      let num=i
     let warningsObj= { 
       warning:data.data[i].warning,
       time:data.data[i].time,
       num:num+1
    }
     
     mywarnings.push(warningsObj)
    }
   
    this.setState({
      getWarnings:mywarnings
    })
     })
    
}
  render() {

    return (
      <div className='home' style={{ backgroundColor: 'white' }}>

        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}
        <Button onClick={this.deleteAllUserNodes} >Delete users node data</Button>
        <div>
        <h1>Tempature Warnings</h1>
{this.state.getWarnings.map((tile) => (
  <div key={tile.num}>
  <li >The Tempature {tile.warning}</li>
  <li >{tile.time}</li>
  </div>
  

))}
</div>
<TemperatureGraph userid={this.props.userId}/>
       <HumidityGraph userid={this.props.userId}/> 
       <RGB userid={this.props.userId}/> 
       <DataCard userid={this.props.userId}/>
       <Temp userid={this.props.userId}/>
      </div>
    )

  }


} export default Dashboard;
