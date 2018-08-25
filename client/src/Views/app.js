import React, {Component} from 'react';
import { BrowserRouter, Route, Switch,Redirect  } from 'react-router-dom';
// Link
import Grid from '@material-ui/core/Grid';
import Rooms from './Rooms/Rooms';
import Room2 from './Rooms/Rooms2';
import Home from "./Home/index";
import Navbar from './Navbar2/Navbar';
import './app.scss';
import axios from "axios";
import Dashboard from './DashBoard/DashBoard';
import Footer from './Footer/Footer';
import SignUp from './UserPages/SignUp/SignUp';
import Verification from './UserPages/Verification/Verification';
import { recover, resetPassword,emailSent,confirmation} from './UserPages/ResetPassword/index'
class App extends Component {
  state = {
    logged: false,
    userDataObj: {},
    theId: '',
    timezone:''
  } 
  componentDidMount = () => {
    // let theuser;
       if (localStorage.auth != null) {
           // console.log('auth')

           axios({
               method: 'post',
               url: '/api/users/auth',
               data: {
                   userToken: localStorage.getItem('auth')

               },
           }).then(user => {
               if (user != null) {
               //console.log(user)
        
           
                   this.setState({
                       logged: true,
                       userDataObj: {
                           email:user.data.email,
                           profilePic: user.data.profilePic, userId: user.data.id, firstName: user.data.firstName,
                           lastName: user.data.lastName, active: user.data.active, verified: user.data.verified
                       },
                      theId: user.data.id,
                      userCreatedAt:user.data.createdAt,
                      timezone:user.data.zone

                   },)
                   
                   // console.log(this.state.userDataObj)
                   // console.log(this.state.theId);
               } else {
                 
               }
           })
       }

      
       
  
   }

   logOutHandler = () => {
    this.setState({ logged: false });
    localStorage.removeItem('auth');

    window.location='/'
}
    render(){
     
        const RoutedDashBoard = (props) => {
            
            return ( 
                <Dashboard
                logged={this.state.logged}
                    component={Dashboard}
                 userId={this.state.theId}
                    theUser={this.state.userDataObj}
                    {...props}
                    
                />
            )
        }
        const RoutedHome = (props) => {
            
            return ( 
                <Home
                logged={this.state.logged}
                    component={Home}
                 
                    theUser={this.state.userDataObj}
                    {...props}
                    
                />
            )
        }
      return (
        <BrowserRouter>
       
        <div className="app">
        
          <Navbar theUser={this.state.userDataObj} logged={this.state.logged} logoutfunction={this.logOutHandler}>

          </Navbar>
      <p>{this.state.timezone}</p>

          <Switch>
          <Route exact path='/' render= {()=>(
              !this.state.logged?(
                <RoutedHome/>
                
              ):(
                <Redirect to='/dashboard' />
              )
          )}/>
          <Route exact path='/dashboard' render={()=>(
            this.state.logged?(
                <RoutedDashBoard/>
          
            ):(
                <Redirect to='/' />
            )
        )}/>
          <Route exact path='/user/rooms' userId={this.state.theId} component={Rooms}/>
          <Route exact path='/user/data/room' userId={this.state.theId} component={Room2}/>
          <Route exact path='/signup' component={SignUp}/>
          <Route exact path='/verification/:id' component={Verification}/>
          <Route exact path='/reset/:token' component={resetPassword}/>
          <Route exact path='/password/reset' component={recover}/>
          <Route exact path='/email/sent' component={emailSent}/>
          <Route exact path='/change/confirmation' component={confirmation}/>
                        </Switch>


                        {/*<Footer />*/}
                       
        </div>
      </BrowserRouter>
      )
    }

  }
 

export default App;


