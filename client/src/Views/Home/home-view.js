
import React, {Component} from 'react';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
class Home extends Component {
  state={
    email: 'david.horn689@gmail.com',
            password: 'projectgreen',
            doesntMatch: false,
            noUser: false
  }
  onChange = (e) => {
       
    this.setState({
        [e.target.name]: e.target.value
    });

}
onSubmit = () => {
  let lowerCaseEmail=this.state.email.toLowerCase()
      const self = this;
      axios({
          method: 'post',
          url: '/api/users/sign/in',
          data: {
              email:lowerCaseEmail ,
              password: this.state.password,
          },
      })
          .then(function (res) {
              if (res.data === 'noMatch') {
                  self.setState({ doesntMatch: true, noUser: false });

              } else if (res.data === 'noUser') {
                  self.setState({ noUser: true, doesntMatch: false });

              }
              else {
               
                  sessionStorage.setItem('auth', res.data)
                 
                  window.location='/dashboard';
              }
          }).catch(function (error) {
              console.log(error);
          });
      //   const currentState = this.state.noMatch;
      //   this.setState({ noMatch: !currentState });
  }
  render(){
    return(
      <div className='home'>
      {console.log(this.state)}
      <TextField
      autoFocus
      margin="dense"
      id="email"
      name='email'
      label="Email Address"
      type="email"
      value={this.state.email}
      onChange={this.onChange}
      
    />
    <br/><br/>
     <TextField
      autoFocus
      margin="dense"
     
      label="Password"
      name='password'
      type="passwordgit"
      value={this.state.password}
      onChange={this.onChange}
    />
  

    <Button onClick={this.onSubmit} color="primary">
    Sign In
    </Button>
    <br/>
    <Button onClick={this.handleClose} color="primary">
    Sign Up
    </Button>
    <br/>
    <Button onClick={this.handleClose} color="primary">
      Forgot Password
    </Button>
    <br/>
    <Button onClick={this.handleClose} color="primary">
      Cancel
    </Button>

    </div>
    )
  
  }


}export default Home
