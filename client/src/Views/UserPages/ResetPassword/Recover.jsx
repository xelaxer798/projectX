import React, { Component } from 'react';
// import users from '../../Data/'
import TextField from '@material-ui/core/TextField';
import usersApi from '../../../Data/users-api';
import Button from '@material-ui/core/Button';


class recover extends Component {
  state = {
    email: ''

  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = () => {
    usersApi.startRecover(this.state.email).then(function (done) {
      console.log(done)
    });
    window.location = '/email/sent';
  };
  render() {

    return (

      <div>
        To Recover your account please first enter your email address.<br />
        Next you will recive an email,click the link to reset your Password.
        <br />
        <TextField
          name="email"
          value={this.state.email}
          label="Email Address"
          onChange={this.onChange} />
        <br />
        <Button type='submit' onClick={this.onSubmit}>
          Reset Password
                        </Button>
      </div>

    );
  };

};
export default recover;