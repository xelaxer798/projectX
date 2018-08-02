import React, { Component } from 'react';
import TemperatureGraph from './Graphs/TemperatureGraph'
import HumidityGraph from './Graphs/HumidityGraph'
import moment from 'moment';
import RGB from './Cards/DataCard'
import DataCard from './Cards/DataCard';
class Dashboard extends Component {
  
  componentDidMount = () => {

    var CurrentDate = moment().format("hh:mm:ss ");
  const  string =CurrentDate._d
    console.log(CurrentDate)


  }

  render() {
    return (
      <div className='home' style={{ backgroundColor: 'white' }}>

        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}

<TemperatureGraph/>
       <HumidityGraph /> 
       <DataCard/>
      </div>
    )

  }


} export default Dashboard;
