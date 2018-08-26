import React, { Component } from 'react';

// import moment from 'moment';

import Logo from '../../Images/Leaf.png';
// import Grid from '@material-ui/core/Grid';
class AccountMain extends Component {
  state = {

  }
  componentDidMount = async() => {
   
  }
  
  render() {
    return (
      <div className='home' style={{ backgroundColor: 'white' }}>
        <img src={Logo} alt='Logo' />
        <br />    <br />    <br />
        This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}
        
      </div>
    )

  }


} export default AccountMain;
