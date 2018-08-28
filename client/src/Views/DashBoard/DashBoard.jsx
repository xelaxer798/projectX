import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import NodesApi from '../../Data/nodes-api';
import WarningsApi from "../../Data/warnings-api"
import Logo from '../../Images/Leaf.png';
import NodeData from './index';

// import moment from 'moment';
// import Grid from '@material-ui/core/Grid';
class Dashboard extends Component {
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
        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}
        <br />    <br />    <br />
        <Button onClick={this.deleteAllUserNodes} >Delete users node data</Button>
        <br />    <br />
        <Button onClick={this.deleteUserWarnings} >Delete users warnings data</Button>
        <NodeData.Warnings.ThreeWarnings userid={this.props.userId} />
 
        <NodeData.Graphs.TemperatureGraph userid={this.props.userId} />
        <NodeData.Graphs.HumidityGraph userid={this.props.userId} />
        <NodeData.Graphs.RGBGraph userid={this.props.userId} /> 
        <NodeData.Graphs.TestGraph userid={this.props.userId}/>
         <NodeData.Cards.RGBCardData userid={this.props.userId} />
        <NodeData.Cards.LuxDataCard userid={this.props.userId} /> *

      </div>
    ) 
    

  }


} export default Dashboard;
