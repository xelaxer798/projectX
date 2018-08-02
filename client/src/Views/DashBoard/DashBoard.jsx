import React, { Component } from 'react';
import TemperatureGraph from './Graphs/TemperatureGraph'
import HumidityGraph from './Graphs/HumidityGraph'

class Dashboard extends Component {
  
  componentDidMount = () => {

   

  }

  render() {
    return (
      <div className='home' style={{ backgroundColor: 'white' }}>

        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}

<TemperatureGraph/>
       <HumidityGraph /> 
      </div>
    )

  }


} export default Dashboard;
