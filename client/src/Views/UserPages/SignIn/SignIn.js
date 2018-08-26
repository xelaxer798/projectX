
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import './Home.css';
import Logo from '../../../Images/Leaf.png'
import usersAPI from '../../../Data/users-api';
class Home extends Component {
  state = {
    email: '',
    password: '',
    doesntMatch: false,
    noUser: false,
    checkBoxe: false,
    zone: ''
  }
  componentDidMount = () => {
    if (localStorage.getItem('UserEmail', this.state.email) !== null) {
      this.setState({
        email: localStorage.getItem('UserEmail'),
      })
    }
  }
  toggleCheck = () => {
    if (this.state.checkBoxe === false) {
      this.setState({
        checkBoxe: true
      })
    }
    else if (this.state.checkBoxe === true) {
      this.setState({
        checkBoxe: false
      })
    }
  }
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  onSubmit = async () => {
    if (this.state.checkBoxe === true) {
      localStorage.setItem('UserEmail', this.state.email)
    }
    let lowerCaseEmail = this.state.email.toLowerCase()
    let res = await usersAPI.signIn(lowerCaseEmail, this.state.password)
    const self = this;
    if (res.data === 'noMatch') {
      self.setState({ doesntMatch: true, noUser: false });
    } else if (res.data === 'noUser') {
      self.setState({ noUser: true, doesntMatch: false });
    }
    else {
      localStorage.setItem('auth', res.data)
      window.location = '/dashboard';
    }
  }
  render() {
    return (
      <div>

        <h4>Master User</h4>
        <p>  email growai798@gmail.com</p>
        <p> password  projectgreen</p>
        <p> User Id: 538f6eb2-f522-4cbd-9a3a-dc4e9433ec5d</p>
        <br />
        <h4>David's User Id</h4>
        <p>9b4c41ef-9e1d-492b-acce-a9bd9eca46a9</p>
        <br />
        <h4>Alex's User Id</h4>
        <p>16abfe25-8869-4693-977f-49dd48e74815</p>
        <h4>Lee's User Id </h4>
        <p>05e64ad4-d91b-4295-87a0-0220133e1c7a</p>
        todo build admin screen
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
                onKeyPress={(ev) => {
                
                  if (ev.key === 'Enter') {
                    this.onSubmit()
                    ev.preventDefault();
                  }
                }}
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
                onKeyPress={(ev) => {
              
                  if (ev.key === 'Enter') {
                    this.onSubmit()
                    ev.preventDefault();
                  }
                }}
              />
            </Grid>

            <Grid item md={6} >
              <div id="remember-me">
                <input onClick={this.toggleCheck} type="checkbox"   onKeyPress={(ev) => {
                
                  if (ev.key === 'Enter') {
                    this.onSubmit()
                    ev.preventDefault();
                  }
                }}/>
                <span>Remember Me</span>
              </div>
            </Grid>
            <Grid item md={6}>
              <a href="/password/reset" id="forgot-pass">Forgot Password</a>
            </Grid>

            <Grid item md={12}>
              <Button variant="contained" onClick={this.onSubmit} color="primary" >
                Log in
            </Button>
              {this.state.noUser &&
                <p>There is no account associated with that email</p>}
              {this.state.doesntMatch &&
                <p>Email or password dont match. Please try again.</p>
              }
            </Grid>

          </Grid>
        </div>
      </div>
    );
  }
}

export default Home;
