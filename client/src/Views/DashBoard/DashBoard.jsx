
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import NodesApi from '../../Data/nodes-api';
import WarningsApi from "../../Data/warnings-api"
import Logo from '../../Images/Leaf.png';
import NodeData from './index';
import moment from 'moment';
import 'moment-timezone';
import functions from '../../Functions/index';
import Grid from '@material-ui/core/Grid';
// import moment from 'moment';

// "2018-04-25T04:41:30.000Z"
class Dashboard extends Component {
  state = {
    CurrentTime: moment().tz("America/Los_Angeles").format(),
    timeFormated: functions.getDashboardFormateTime('dont'),
  };
  componentDidCatch = (error, info) => {
    console.log('hi i am catching Dashboard');
    console.log(error, 'hi im errors at dash')
    console.log(info, 'hi im info at dash')
  };
  updateTime = () => {
    this.setState({
      CurrentTime: moment().tz("America/Los_Angeles").format(),
      timeFormated: functions.getDashboardFormateTime('dont')
    });
  };
  componentDidMount = () => {
    setInterval(this.updateTime, 1000);

    const heyt = moment(this.state.CurrentTime).subtract(1, 'days');

    this.setState({
      timeToStartTemp: moment(heyt._d).tz("America/Los_Angeles").format('YYYY-MM-DD'),
      timeToEndTemp: moment(this.state.CurrentTime).format('YYYY-MM-DD')
    });
  };

 
  deleteUserWarnings = () => {
    let yesOrNo = window.confirm(`Are You Sure you want to Delete this users warnings with the user Id of ${this.props.userId}!?!`);
    if (yesOrNo === true) {
      WarningsApi.delete(this.props.userId);
    };
    
  }
  deleteAllUserNodes = () => {
    let yesOrNo = window.confirm(`Are You Sure you want to Delete this users node data with the user Id of ${this.props.userId}!?!`);
    if (yesOrNo === true) {
      NodesApi.delete(this.props.userId);
    };
  };
  render() {
    let notice=null;
    if(this.props.userId==='9b4c41ef-9e1d-492b-acce-a9bd9eca46a9'){
notice=<div>
  <h4>Node start and stop reports</h4>
  <li>The node started reported at 12:41 am and stopped at tbd</li>
  <li>The node started reported at 12:12 am and stopped at 12:17 am</li>
  <li>The node started reported at TBD and stopped at TDB</li>
</div>
    };
    return (
      <div className='home' style={{ backgroundColor: 'white' }}>
        <img src={Logo} alt='Logo' />
        <br />    <br />    <br />
        {this.state.timeFormated}
        <br />  <br />  <br />
        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}
        {notice}
        

        <br />    <br />    <br />
        <Button onClick={this.deleteAllUserNodes} >Delete users node data</Button>
        <br />    <br />
        
        <NodeData.Warnings.ThreeWarnings userid={this.props.userId} delete={()=>this.deleteUserWarnings} />
        <br /><br />
        <Grid container spacing={40}>
        <Grid item xs={4} lg={5}>
        <NodeData.Graphs.TemperatureGraph userid={this.props.userId} />
        </Grid>
     
        <Grid item xs={4} lg={5}>
        <NodeData.Graphs.HumidityGraph userid={this.props.userId} />
        </Grid>
        </Grid>
        <Grid container spacing={40}>
        <Grid item xs={2} lg={6}>
        <NodeData.Graphs.RGBGraph userid={this.props.userId} />
        </Grid>
        <Grid item xs={2} lg={5}>
        <NodeData.Graphs.LuxIRGraph userid={this.props.userId}  />
        </Grid>
      </Grid>
        {/* <NodeData.Graphs.LuxIRGraph userid={this.props.userId} tickType={'%a %I:%M%p %e-%b'} title={'Lux/IR Graph Last Day'} />
   <NodeData.Graphs.ResuseabelGraph userid={this.props.userId} tickType={'%a  %e-%b'} title={'Lux/IR Graph Last Month'} range={['2018-08-01', '2018-08-31']}datatype={'Lux,IR'}/> */}
   <Grid container spacing={16}>
   <Grid item xs={4} lg={4}>
        <NodeData.Cards.LuxDataCard userid={this.props.userId} />
        </Grid>
        <Grid item xs={4} lg={4}>
        <NodeData.Cards.RGBCardData userid={this.props.userId} />
        </Grid>
        <Grid item xs={4} lg={4}>
        <NodeData.Cards.TempHumidCard userid={this.props.userId} />
        </Grid>
        </Grid>

      </div>
    );
  };
};
export default Dashboard;
