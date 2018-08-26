import React, { Component } from 'react';
import WarningsApi from "../../../Data/warnings-api";
import Grid from '@material-ui/core/Grid';
class Warnings extends Component {
state={
    tempatureWarnings: [],
    humidityWarnings: [],
    RGBWarnings: [],
    deviceWarnings: [],
}
componentDidMount = async() => {
    // let warnings=await  WarningsApi.getWarnings(this.props.userid)
    //    this.setState({
    //      tempatureWarnings: warnings.data.tempature,
    //      humidityWarnings: warnings.data.humidity,
    //      deviceWarnings: warnings.data.device
    //    })
  
     setInterval(this.getWarnings, 1000);
   }
getWarnings = async() => {
    let warnings=await  WarningsApi.getWarnings(this.props.userid)
  
    this.setState({
      tempatureWarnings: warnings.data.tempature,
      humidityWarnings: warnings.data.humidity,
      deviceWarnings: warnings.data.device
    })
  }
render(){
    return(
        <Grid container spacing={16}>
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
            <h3>Device Warnings</h3>

            {this.state.deviceWarnings.slice(0, 5).map((tile) => (
              <div key={tile.num}>
                <li >The {tile.warning}</li>
                <li >{tile.time}</li>
              </div>


            ))}
          </Grid>
        </Grid>
    )
}
}

export default Warnings;