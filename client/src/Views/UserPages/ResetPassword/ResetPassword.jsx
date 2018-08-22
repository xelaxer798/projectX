import React, {Component } from 'react';
import TextField from '@material-ui/core/TextField';
import usersApi from '../../../Data/users-api';
import Button from '@material-ui/core/Button';
import axios from "axios";  

class recover extends Component{
    state={
        pass:"",
        passswordConfirm:"",
        userId:"" ,
        email:'',
        name:'',
        noMatch:false,
        Auth:true
    }
  
    componentDidMount =async () => {
        console.log(this.props)
    let Auth=await   usersApi.checkPassJwt(this.props.match.params.token)
 console.log(Auth)
           if(Auth.data.AuthStatus==="AuthOkay"){
               this.setState({
                   Auth:true,
                   userId:Auth.data.userId,
                   email:Auth.data.email,
                   name:Auth.data.name
               })
           }else{
            this.setState({
                Auth:false
            })
           }
     
    }
    
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
     
    }
   
    onSubmit =async()=>{
        console.log(this.state.id)
        if(this.state.pass===this.state.passswordConfirm){
          usersApi.changePass(this.state.userId,this.state.pass,this.state.email,this.state.name)
              
window.location='/change/confirmation'
     
               
      
        }
        else {
            const currentState = this.state.noMatch;
            this.setState({ noMatch: !currentState });
        }
   
       
 
    }

  render() {

    return (   

     <div>{this.state.Auth?
       
        <div>{this.state.noMatch &&
            <p className={this.state.noMatch ? 'noMatch': null} >Your passwords do not match</p>
            }
        <TextField
    type='password'
        name="pass"
        value={this.state.pass}
     label="password"
        onChange={this.onChange} 
         
        className={this.state.noMatch ? 'noMatch': null} 
        /><br/>
        <TextField
        type='password'
        name="passswordConfirm"
        value={this.state.passswordConfirm}
        label="passsword confirm"
        onChange={this.onChange} 
         
        className={this.state.noMatch ? 'noMatch': null} 
        />
    <br />
    <Button  onClick={this.onSubmit}>
   Reset Password
                        </Button>
        </div>:<div><h1>This Link has Expired or you do not have access to the account</h1></div>}
        </div>
    )
  }

}
export default recover;