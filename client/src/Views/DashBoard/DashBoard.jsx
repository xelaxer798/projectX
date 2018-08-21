import React, { Component } from 'react';
import TemperatureGraph from './Graphs/TemperatureGraph'
import HumidityGraph from './Graphs/HumidityGraph'
import moment from 'moment';
import RGB from './Graphs/RGBGraph'
import Button from '@material-ui/core/Button';
import DataCard from './Cards/DataCard';
import Temp from './Cards/TempDataCard';
import NodesApi from '../../Data/nodes-api';
import WarningsApi from "../../Data/warnings-api"
import Logo from '../../Images/Leaf.png';
import Grid from '@material-ui/core/Grid';
class Dashboard extends Component {
  state={
    r:0,
    g:0,
    b:0,
    time:'',
    tempatureWarnings:[],
    humidityWarnings:[],
    RGBWarnings:[],
    deviceWarnings:[],
    userId:''
            }
  componentDidMount = () => {
    this.getWarnings()
    setInterval(this.getWarnings, 10000);
  }
  deleteUserWarnings=()=>{
    let yesOrNo=  window.confirm(`Are You Sure you want to Delete this users warnings with the user Id of ${this.props.userId}!?!`);
    if(yesOrNo ===true){
      WarningsApi.delete(this.props.userId)
    }
    this.getWarnings()
  }
  deleteAllUserNodes=()=>{
    let yesOrNo=  window.confirm(`Are You Sure you want to Delete this users node data with the user Id of ${this.props.userId}!?!`);
    if(yesOrNo ===true){
      NodesApi.delete(this.props.userId)
    }
    

  }
getWarnings=()=>{
  
  WarningsApi.getWarnings(this.props.userId).then(data => {
  console.log(data.data)
    const tempatureWarnings=[];
    const humidityWarnings=[];
    const RGBWarnings=[];
 const deviceWarnings=[];

    for(let i=0;i<data.data.length;i++){
      let num=i;
      let warningsObj;
      try{
        let tellwhich= data.data[i].warning.split(' ');
        if(tellwhich[0]==='Temperature'){
          warningsObj= { 
            warning:data.data[i].warning,
            time:data.data[i].time,
            num:num+1
         }
          
         tempatureWarnings.push(warningsObj)
        }
        else if(tellwhich[0]==='Humidity'){
          warningsObj= { 
            warning:data.data[i].warning,
            time:data.data[i].time,
            num:num+1
         }
         humidityWarnings.push(warningsObj)
        }
        else if(tellwhich[0]==='RGB'){
          warningsObj= { 
            warning:data.data[i].warning,
            time:data.data[i].time,
            num:num+1
         }
         RGBWarnings.push(warningsObj)
        }
        else if(tellwhich[0]==='Node'){
          warningsObj= { 
            warning:data.data[i].warning,
            time:data.data[i].time,
            num:num+1
         }
         deviceWarnings.push(warningsObj)
        }
      }
   catch(err){
console.log(err)
   }
   console.log(deviceWarnings)
  const tempReversed= tempatureWarnings.reverse();
  const humidityWarningsReversed=humidityWarnings.reverse();
  const RGBWarningsReversed =RGBWarnings.reverse();
  console.log(tempatureWarnings)
    this.setState({
      tempatureWarnings:tempReversed,
      humidityWarnings:humidityWarningsReversed,
      RGBWarnings:RGBWarningsReversed,
      deviceWarnings:deviceWarnings
    })
  }
     })
    
}
  render() {

    return (
      <div className='home' style={{ backgroundColor: 'white' }}>
<img src={Logo} alt='Logo'/>
<br/>    <br/>    <br/>
        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}
        <br/>    <br/>    <br/>
        <Button onClick={this.deleteAllUserNodes} >Delete users node data</Button>
        <br/>    <br/>   
        <Button onClick={this.deleteUserWarnings} >Delete users warnings data</Button>
        <Grid container  spacing={10}>
        <Grid item xs={3}>
     
        <h3>Tempature Warnings</h3>
{this.state.tempatureWarnings.slice(0, 5).map((tile) => (
  <div key={tile.num}>
  <li >The {tile.warning} °</li>
  <li >{tile.time}</li>
  </div>
  

))}
</Grid>
<Grid item xs={3}>
        <h3>Humidity Warnings</h3>
{this.state.humidityWarnings.slice(0, 5).map((tile) => (
  <div key={tile.num}>
  <li >The {tile.warning} %</li>
  <li >{tile.time}</li>
  </div>
  

))}
</Grid>
<Grid item xs={3}>
        <h3>RGB Warnings</h3>
{this.state.RGBWarnings.slice(0, 5).map((tile) => (
  <div key={tile.num}>
  <li >The {tile.warning}</li>
  <li >{tile.time}</li>
  </div>
  

))}
</Grid>
<Grid item xs={3}>
        <h3>Device Warnings</h3>
      
{this.state.deviceWarnings.slice(0, 5).map((tile) => (
  <div >
  <li >The {tile.warning}</li>
  <li >{tile.time}</li>
  </div>
  

))}
</Grid>
</Grid>
<TemperatureGraph userid={this.props.userId}/>
       <HumidityGraph userid={this.props.userId}/> 
       <RGB userid={this.props.userId}/> 
       <DataCard userid={this.props.userId}/>
       <Temp userid={this.props.userId}/>
      </div>
    )

  }


} export default Dashboard;
