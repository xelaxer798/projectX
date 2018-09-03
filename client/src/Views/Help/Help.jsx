import React, { Component } from 'react';
import Logo from '../../Images/Leaf.png';
// import Grid from '@material-ui/core/Grid';
// import moment from 'moment';
class Help extends Component {

  componentDidMount = async () => {

  };

  render() {
    return (
      <div className='home' style={{ backgroundColor: 'white' }}>
        <img src={Logo} alt='Logo' />
        <br />    <br />    <br />
        <h1>What can we help you with today?</h1>

      </div>
    );

  };


};
export default Help;
