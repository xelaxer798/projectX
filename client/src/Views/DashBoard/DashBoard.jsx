import React, { Component } from 'react';
import TemperatureGraph from './Graphs/TemperatureGraph'
import HumidityGraph from './Graphs/HumidityGraph'
import moment from 'moment';
import RGB from './Cards/DataCard'
import DataCard from './Cards/DataCard';
import Temp from './Cards/TempDataCard'
class Dashboard extends Component {
  state={
    r:0,
    g:0,
    b:0,
    time:''
            }
  componentDidMount = () => {

 

  }

  render() {
    return (
      <div className='home' style={{ backgroundColor: 'white' }}>

        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}

<TemperatureGraph userid={this.props.userId}/>
       <HumidityGraph userid={this.props.userId}/> 
       <DataCard userid={this.props.userId}/>
       <Temp userid={this.props.userId}/>
      </div>
    )

  }


} export default Dashboard;
