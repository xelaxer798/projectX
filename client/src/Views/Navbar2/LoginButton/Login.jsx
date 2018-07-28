
import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSignInDialogue: false,
            open: false,
            email: 'david.horn689@gmail.com',
            password: 'projectgreen',
            doesntMatch: false,
            noUser: false

        }
    }
    onChange = (e) => {
       
        this.setState({
            [e.target.name]: e.target.value
        });

    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };




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
                    self.handleClose();
                    window.location.reload(true);
                }
            }).catch(function (error) {
                console.log(error);
            });
        //   const currentState = this.state.noMatch;
        //   this.setState({ noMatch: !currentState });
    }
    static muiName = 'Button';
    render(){
        const {
             fullScreen } = this.props;
      
        return(
            <div className=''>
            {        console.log(this.state.password)}
            <div className='LogInSection'>
                    <Button style={{color:'white'}} {...this.props} onClick={this.handleOpen} >Login</Button>
                </div>
<Dialog

fullScreen={fullScreen}
open={this.state.open}
onClose={this.handleClose}
aria-labelledby="responsive-dialog-title"
>
<DialogTitle id="responsive-dialog-title">{"Sign In"}</DialogTitle>

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

<DialogActions>
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
</DialogActions>
</Dialog>
</div>
        )
    }
}
export default Login;