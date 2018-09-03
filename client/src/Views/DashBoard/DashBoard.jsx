
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
  state = {
    CurrentTime: moment().tz("America/Los_Angeles").format(),
    timeFormated: functions.getDashboardFormateTime(),
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

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,

    }, this.changeGraphData);
  };
  checkWhichGraphToChange = (event) => {
    console.log(event.target.graph);
  };

  deleteUserWarnings = () => {
    let yesOrNo = window.confirm(`Are You Sure you want to Delete this users warnings with the user Id of ${this.props.userId}!?!`);
    if (yesOrNo === true) {
      WarningsApi.delete(this.props.userId);
    };
    this.getWarnings();
  }
  deleteAllUserNodes = () => {
    let yesOrNo = window.confirm(`Are You Sure you want to Delete this users node data with the user Id of ${this.props.userId}!?!`);
    if (yesOrNo === true) {
      NodesApi.delete(this.props.userId);
    };
  };
  render() {
    return (
      <div className='home' style={{ backgroundColor: 'white' }}>
        <img src={Logo} alt='Logo' />
        <br />    <br />    <br />
        {this.state.timeFormated}
        <br />  <br />  <br />
        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}


        <br />    <br />    <br />
        <Button onClick={this.deleteAllUserNodes} >Delete users node data</Button>
        <br />    <br />
        <Button onClick={this.deleteUserWarnings} >Delete users warnings data</Button>
        <NodeData.Warnings.ThreeWarnings userid={this.props.userId} />
        <br /><br />
        <NodeData.Graphs.TemperatureGraph userid={this.props.userId} />
        <br /> <br />
        <NodeData.Graphs.HumidityGraph userid={this.props.userId} />
        <br /> <br />
        <NodeData.Graphs.RGBGraph userid={this.props.userId} />
        <br /> <br />

        {/* <NodeData.Graphs.LuxIRGraph userid={this.props.userId} tickType={'%a %I:%M%p %e-%b'} title={'Lux/IR Graph Last Day'} />
   <NodeData.Graphs.ResuseabelGraph userid={this.props.userId} tickType={'%a  %e-%b'} title={'Lux/IR Graph Last Month'} range={['2018-08-01', '2018-08-31']}datatype={'Lux,IR'}/> */}
        <br /> <br /> <br />
        <NodeData.Cards.LuxDataCard userid={this.props.userId} />
        <br /> <br /> <br />
        <NodeData.Cards.RGBCardData userid={this.props.userId} />


      </div>
    );
  };
};
export default Dashboard;
