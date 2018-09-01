import React, { Component } from 'react';
import WarningsApi from "../../../Data/warnings-api";
import Grid from '@material-ui/core/Grid';
import Images from '../../../Images/index';
class Warnings extends Component {
  state = {
    tempatureWarnings: [],
    humidityWarnings: [],
    RGBWarnings: [],
    deviceWarnings: [],
    loading:true
  }
  componentDidCatch = (error, info) => {
    console.log('hi i am catching warnings');
    console.log(error, 'hi im errors at warnings');
    console.log(info, 'hi im info at warnings');
  };
  componentDidMount = () => {

    setTimeout(this.getWarnings, 1000)
    setInterval(this.getWarnings, 2000);
  };
  getWarnings =async () => {
  let warnings=await  WarningsApi.getWarnings(this.props.userid)
     
      this.setState({
        tempatureWarnings: warnings.data.tempature,
        humidityWarnings: warnings.data.humidity,
        deviceWarnings: warnings.data.device,
        loading:false
      })
  


  }
  render() {
    return (
     <div>
      {!this.state.loading?  <Grid container spacing={16}> <Grid item xs={3}>

<h3>Tempature Warnings</h3>
{this.state.tempatureWarnings.map((tile) => (
  <div key={tile.num}>
    <li >The {tile.warning} °</li>
    <li >{tile.time}</li>
  </div>


))}
</Grid>
<Grid item xs={3}>
<h3>Humidity Warnings</h3>
{this.state.humidityWarnings.map((tile) => (
  <div key={tile.num}>
    <li >The {tile.warning} %</li>
    <li >{tile.time}</li>
  </div>


))}
</Grid>

<Grid item xs={3}>
<h3>Device Warnings</h3>

{this.state.deviceWarnings.map((tile) => (
  <div key={tile.num}>
    <li >The {tile.warning}</li>
    <li >{tile.time}</li>
  </div>
))}
</Grid></Grid>:<div>
  <h1>Your Warnings are loading</h1>
 <img src={Images.loadingGif} alt='loading'/>
 </div>}
       
</div>
    )
  }
}

export default Warnings;