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

<TemperatureGraph/>
       <HumidityGraph /> 
       <DataCard/>
       <Temp/>
      </div>
    )

  }


} export default Dashboard;
