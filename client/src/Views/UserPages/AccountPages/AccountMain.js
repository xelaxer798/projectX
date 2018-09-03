import React, { Component } from 'react';
import Logo from '../../../Images/Leaf.png';
// import Grid from '@material-ui/core/Grid';
// import moment from 'moment';
class AccountMain extends Component {

  componentDidMount = async () => {

  };

  render() {
    return (
      <div className='home' style={{ backgroundColor: 'white' }}>
        <img src={Logo} alt='Logo' />
        <br />    <br />    <br />
        This is your Account Page {this.props.theUser.firstName} {this.props.theUser.lastName}

      </div>
    );

  };


};
export default AccountMain;
