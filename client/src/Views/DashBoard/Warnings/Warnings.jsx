import React, { Component } from 'react';
import WarningsApi from "../../../Data/warnings-api";
import Grid from '@material-ui/core/Grid';
import Images from '../../../Images/index';
import Button from '@material-ui/core/Button';
import Constants from '../Constants/index';

class Warnings extends Component {
  state = {
    tempatureWarnings: [],
    humidityWarnings: [],
    RGBWarnings: [],
    deviceWarnings: [],
    loading: true,
    tempLength: 0,
    humidLength: 0,
    deviceLength: 0,
    statusCode:'status code will appear here'

  };
  componentDidCatch = (error, info) => {
    console.log('hi i am catching warnings');
    console.log(error, 'hi im errors at warnings');
    console.log(info, 'hi im info at warnings');
  };
  componentDidMount = () => {

    setTimeout(this.getWarnings, Constants.timeoutAndIntervalSettings.warningTimeout);
    setInterval(this.getWarnings, Constants.timeoutAndIntervalSettings.warningUpdateInterval);
  };
  getWarnings = async () => {
    let warnings = await WarningsApi.getWarnings(this.props.userid);
  console.log(warnings.data.tempature.length);
      this.setState({
        tempLength: warnings.data.tempature.length,
        humidLength: warnings.data.humidity.length,
        deviceLength: warnings.data.device.length,
        tempatureWarnings: warnings.data.tempature,
        humidityWarnings: warnings.data.humidity,
        deviceWarnings: warnings.data.device,
        loading: false,
        statusCode:`Warnings Status Code: ${warnings.status}  `
      });
   

  };
  render() {
    let tempatureWarnings = null;
    let humidityWarnings = null;
    let deviceWarnings = null;
    if (this.state.tempLength < 1) {
      tempatureWarnings = <div></div>
    }
    else {
      tempatureWarnings = this.state.tempatureWarnings.map((tile) => (
        <div key={tile.num}>
          <li >{tile.warning} </li>
          <li >{tile.time}</li>
        </div>
      ));
    };
    if (this.state.humidLength < 1) {
      humidityWarnings = <div></div>
    }
    else {
      humidityWarnings = this.state.humidityWarnings.map((tile) => (
        <div key={tile.num}>
          <li >{tile.warning} </li>
          <li >{tile.time}</li>
        </div>
      ));
    };

    //Device Warnings
    if (this.state.deviceLength < 1) {
      deviceWarnings = <div></div>
    }
    else {
      deviceWarnings = this.state.deviceWarnings.map((tile) => (
        <div key={tile.num}>
          <li >{tile.warning} </li>
          <li >{tile.time}</li>
        </div>
      ));
    };
    return (
      <div>
     
        <Button onClick={this.props.delete()} >Delete users warnings data</Button>
        <br/>
        {this.state.statusCode}
      <br/>
        {!this.state.loading ?
          <Grid container spacing={16}>
            <Grid item xs={3}>
              <h3>Temperature Warnings</h3>
              {tempatureWarnings}
            </Grid>
            <Grid item xs={3}>
              <h3>Humidity Warnings</h3>
              {humidityWarnings}
            </Grid>

            <Grid item xs={3}>
              <h3>Device Warnings</h3>
              {deviceWarnings}
            </Grid></Grid> : <div>
            <h1>Your Warnings are loading</h1>
            <img src={Images.loadingGif} alt='loading' />
          </div>}

      </div>
    );
  };
};

export default Warnings;