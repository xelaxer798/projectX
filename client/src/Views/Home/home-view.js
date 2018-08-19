
import React, {Component} from 'react';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import './Home.css';
import Logo from '../../Images/Leaf.png'
class Home extends Component {
  state={
    email: 'jeff@gmail.com',
            password: 'projectgreen',
            doesntMatch: false,
            noUser: false
  }
  componentDidMount = () => {
   
  }
  componentDidUpdate =()=>{

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
        <div id='home'>
        <Grid container spacing={24}>
          <Grid item md={12}>
            <img 
              src={Logo} 
              id="logo"
              alt='logo'
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              id="email"
              name='email'
              type="email"
              value={this.state.email}
              onChange={this.onChange}
            />
          </Grid>

          <Grid item md={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Password"
              name='password'
              type="password"
              value={this.state.password}
              onChange={this.onChange}
            />
          </Grid>

          <Grid item md={6}>
            <div id="remember-me">
              <input type="checkbox" />
              <span>Remember Me</span>
            </div>
          </Grid>
          <Grid item md={6}>
            <a href="/forgot" id="forgot-pass">Forgot Password</a>
          </Grid>

          <Grid item md={12}>
            <Button variant="contained" onClick={this.onSubmit} color="primary">
              Log in
            </Button>
          </Grid>

        </Grid>
      </div>
    );
  }
}

export default Home;

