import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import NodesApi from '../../Data/nodes-api';
import WarningsApi from "../../Data/warnings-api"
import Logo from '../../Images/Leaf.png';
import NodeData from './index';
import moment from 'moment';
import 'moment-timezone';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import functions from '../../Functions/index';
// import moment from 'moment';
// import Grid from '@material-ui/core/Grid';
      // "2018-04-25T04:41:30.000Z"
class Dashboard extends Component {
  state={
  CurrentTime :moment().tz("America/Los_Angeles").format(),
  timeFormated: functions.getDashboardFormateTime(),
  timeTempLength:'day',
  timeHumdLength:'day',
  timeLuxIrLength:'day',
  timeToStartTemp:'',
  timeToEndTemp:'',
  timeToStartHumd:'',
  timeToEndHumd:'',
  timeToStartLuxIr:'',
  timeToEndLuxIr:'',
  tickFormat:'%I:%M %p'
  }
   updateTime=()=>{
    this.setState({
        CurrentTime: moment().tz("America/Los_Angeles").format(),
        timeFormated:functions.getDashboardFormateTime()
    });
};
  componentDidMount=()=>{
 setInterval(this.updateTime,1000);
    
   const heyt=moment(this.state.CurrentTime).subtract(1, 'days');
  
   this.setState({
 timeToStartTemp:moment(heyt._d).tz("America/Los_Angeles").format('YYYY-MM-DD'),
timeToEndTemp:moment(this.state.CurrentTime).format('YYYY-MM-DD')
   });
  }
 
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value,
    
  },this.changeGraphData);
  };
  checkWhichGraphToChange=(event)=>{
console.log(event.target.graph)
  }
  changeGraphData=(timeLenght)=>{

    if(this.state.timeTempLength==='day'){
      const heyt=moment(this.props.currenttime).subtract(1, 'days');
      this.setState({
    timeToStartTemp:moment(heyt._d).tz("America/Los_Angeles").format('YYYY-MM-DD'),
   timeToEndTemp:moment(this.props.currenttime).format('YYYY-MM-DD'),
   tickFormat:'%I:%M %p'
      });
    }
    else if(this.state.timeTempLength==='hour'){
      const heyt=moment(this.props.currenttime).subtract(1, 'hour');
      this.setState({
         timeToStartTemp:moment(heyt._d).tz("America/Los_Angeles").format('YYYY-MM-DD HH:MM'),
        timeToEndTemp:moment(this.props.currenttime).format('YYYY-MM-DD HH:MM'),
        tickFormat:'%I:%M %p'
           });
    }
    else if(this.state.timeTempLength==='week'){
      const heyt=moment(this.props.currenttime).subtract(7, 'days');
      this.setState({
         timeToStartTemp:moment(heyt._d).tz("America/Los_Angeles").format(),
        timeToEndTemp:moment(this.props.currenttime).format(),
        tickFormat:'%a  %e-%b'
           });
    }
    else if(this.state.timeTempLength==='month'){
    const month=  moment(this.props.currenttime).tz("America/Los_Angeles").format('M')
      const monthsWith31Days=['1','3','5','7','8','10','12'];
      const monthsWith30Days=['4', '6','9' ,'11'];
      let days;
    for(let i=0;i<monthsWith31Days.length;i++){
      if(monthsWith31Days[i]===month){
      days=31;
      }else {
        for(let b=0;b<monthsWith30Days.length;b++){
          if(monthsWith30Days[b]===month){
          days= 30;
          }
        }
      }
    }
  
 const heyt=moment(this.props.currenttime).subtract(days, 'days');
  
      this.setState({
         timeToStartTemp:moment(heyt._d).tz("America/Los_Angeles").format(),
        timeToEndTemp:moment(this.props.currenttime).format(),
        tickFormat:'%a  %e-%b'
           });
    }
    else if(this.state.timeTempLength=== 'year'){
      const heyt=moment(this.props.currenttime).subtract(365, 'days');
      this.setState({
         timeToStartTemp:moment(heyt._d).tz("America/Los_Angeles").format(),
        timeToEndTemp:moment(this.props.currenttime).format(),
        tickFormat:'%a  %e-%b'
           });
    }
  }
  deleteUserWarnings = () => {
    let yesOrNo = window.confirm(`Are You Sure you want to Delete this users warnings with the user Id of ${this.props.userId}!?!`);
    if (yesOrNo === true) {
      WarningsApi.delete(this.props.userId)
    }
    this.getWarnings()
  }
  deleteAllUserNodes = () => {
    let yesOrNo = window.confirm(`Are You Sure you want to Delete this users node data with the user Id of ${this.props.userId}!?!`);
    if (yesOrNo === true) {
      NodesApi.delete(this.props.userId)
    }
  }
  render() {
    return (
      <div className='home' style={{ backgroundColor: 'white' }}>
        <img src={Logo} alt='Logo' />
        <br />    <br />    <br />
        {this.state.timeFormated}
        <br/>  <br/>  <br/>
        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}
      
      
        <br />    <br />    <br />
        <Button onClick={this.deleteAllUserNodes} >Delete users node data</Button>
        <br />    <br />
        <Button onClick={this.deleteUserWarnings} >Delete users warnings data</Button>
        <NodeData.Warnings.ThreeWarnings userid={this.props.userId} />
        <br/>
        <br/>
   
        <InputLabel htmlFor="age-simple">Please Choose the Length of Time to see your Data</InputLabel>
        <br/>
        <Select
        autoWidth
            value={this.state.timeTempLength}
            onChange={this.handleChange}
            input={<Input name="timeTempLength" id="timeTempLength"  />}
          > 

      
            <MenuItem name={'day'}value={'day'}>Last Day</MenuItem>
            <MenuItem name={'hour'}value={"hour"}>Last Hour </MenuItem>
            <MenuItem value={'week'}>Last Week</MenuItem>
            <MenuItem value={'month'}>Last Month</MenuItem>
            <MenuItem value={'year'}>Last Year</MenuItem>
          </Select>
        
        <NodeData.Graphs.TemperatureGraph userid={this.props.userId} tickFormat={this.state.tickFormat}range={[this.state.timeToStartTemp, this.state.timeToEndTemp]} />
        
        <NodeData.Graphs.HumidityGraph userid={this.props.userId}range={['2018-08-28 10:00', '2018-08-28 11:00']} />
        <NodeData.Graphs.RGBGraph userid={this.props.userId} /> 
   <NodeData.Graphs.LuxIRGraph userid={this.props.userId} tickType={'%I:%M %p'} title={'Lux/IR Graph 1 Day'}/>
   {/* <NodeData.Graphs.LuxIRGraph userid={this.props.userId} tickType={'%a %I:%M%p %e-%b'} title={'Lux/IR Graph Last Day'} />
   <NodeData.Graphs.ResuseabelGraph userid={this.props.userId} tickType={'%a  %e-%b'} title={'Lux/IR Graph Last Month'} range={['2018-08-01', '2018-08-31']}datatype={'Lux,IR'}/> */}
   <br/> <br/> <br/>
   <NodeData.Cards.LuxDataCard userid={this.props.userId} /> 
         <NodeData.Cards.RGBCardData userid={this.props.userId} />
        

      </div>
    ) 
    

  }


} export default Dashboard;
