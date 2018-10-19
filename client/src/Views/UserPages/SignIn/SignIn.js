
import React, { Component, PureComponent } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import './Home.css';
import Images from '../../../Images/index';
import usersAPI from '../../../Data/users-api';

// var _ = require('lodash');
// // Load the core build.
// var _ = require('lodash/core');
// // Load the FP build for immutable auto-curried iteratee-first data-last methods.
// var fp = require('lodash/fp');

// // Load method categories.
// var array = require('lodash/array');
// var object = require('lodash/fp/object');

// // Cherry-pick methods for smaller browserify/rollup/webpack bundles.
// var at = require('lodash/at');
// var curryN = require('lodash/fp/curryN');
class Home extends PureComponent {
  state = {
    email: '',
    password: '',
    doesntMatch: false,
    noUser: false,
    checkBoxe: false,
    zone: '',
    loading: false
  };
  // componentWillReceiveProps (nextProps) {
  //   const changedProps = _.reduce(this.props, function (result, value, key) {
  //     return _.isEqual(value, nextProps[key])
  //       ? result
  //       : result.concat(key)
  //   }, [])
  //   console.log('changedProps: ', changedProps)
  // }
  // shouldComponentUpdate=(nextProps, nextState) =>{
  //   console.log(nextProps,nextState)
  //   return false;
  // }
  componentDidMount = () => {
    if (localStorage.getItem('UserEmail', this.state.email) !== null) {
      this.setState({
        email: localStorage.getItem('UserEmail'),
      });
    };
  };
  toggleCheck = () => {
    if (this.state.checkBoxe === false) {
      this.setState({
        checkBoxe: true
      });
    }
    else if (this.state.checkBoxe === true) {
      this.setState({
        checkBoxe: false
      });
    };
  };
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  onSubmit = async () => {
    this.setState({
      loading: true,
      noUser: false,
      doesntMatch: false
    });
    if (this.state.checkBoxe === true) {
      localStorage.setItem('UserEmail', this.state.email)
    };
    let lowerCaseEmail = this.state.email.toLowerCase()
    let res = await usersAPI.signIn(lowerCaseEmail, this.state.password)
    const self = this;
    if (res.data === 'noMatch') {
      self.setState({ doesntMatch: true, noUser: false, loading: false });
    } else if (res.data === 'noUser') {
      self.setState({ noUser: true, doesntMatch: false, loading: false });
    }
    else {
console.log("Authenticated user: " + res.data);
      localStorage.setItem('auth', res.data)
      window.location = '/dashboard';
    };
  };
  componentDidCatch = (error, info) => {
    console.log('hi i am catching Sign In');
    console.log(error, 'hi im errors at sign in');
    console.log(info, 'hi im info at sign in');
  };
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
                src={Images.companyLogo}
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
                    this.onSubmit();
                    ev.preventDefault();
                  };
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
                    this.onSubmit();
                    ev.preventDefault();
                  };
                }}
              />
            </Grid>

            <Grid item md={6} >
              <div id="remember-me">
                <input onClick={this.toggleCheck} type="checkbox" onKeyPress={(ev) => {

                  if (ev.key === 'Enter') {
                    this.onSubmit();
                    ev.preventDefault();
                  };
                }} />
                <span>Remember Me</span>
              </div>
            </Grid>
            <Grid item md={6}>
              <a href="/password/reset" id="forgot-pass">Forgot Password</a>
            </Grid>

            <Grid item md={12}>
              {this.state.loading ?
                <img src={Images.loadingGif} alt='loading' width={30} height={40} /> :
                <Button variant="contained" onClick={this.onSubmit} color="primary" >
                  Log in
            </Button>}
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
  };
};

export default Home;

