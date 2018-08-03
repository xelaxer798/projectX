import React, {Component} from 'react';
import { BrowserRouter, Route, Switch,Redirect  } from 'react-router-dom';
// Link
import Grid from '@material-ui/core/Grid';
import Rooms from './Rooms/Rooms'
import Room2 from './Rooms/Rooms2'
import Home from "./Home/index"
import Navbar from './Navbar2/Navbar'
import './app.scss'
import axios from "axios";
import Dashboard from './DashBoard/DashBoard'
import Footer from './Footer/Footer'

class App extends Component {
  state = {
    logged: false,
    userDataObj: {},
    theId: '',
  } 
  componentDidMount = () => {
    // let theuser;
       if (sessionStorage.auth != null) {
           // console.log('auth')

           axios({
               method: 'post',
               url: '/api/users/auth',
               data: {
                   userToken: sessionStorage.getItem('auth')

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
                      userCreatedAt:user.data.createdAt


                   },)
                   this.checkUserStatus()
                   // console.log(this.state.userDataObj)
                   // console.log(this.state.theId);
               } else {
                 
               }
           })
       }

      
       
  
   }
checkUserStatus=()=>{
    const url = window.location.toString().split('/');
    <Redirect to='/dashboard' />
    if(this.state.logged===true){
        console.log(this.state.logged)
        

    }
}
   logOutHandler = () => {
    this.setState({ logged: false });
    sessionStorage.removeItem('auth');
    localStorage.clear();
    window.location='/'
}
    render(){
        this.checkUserStatus
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
          <Route exact path='/user/rooms' component={Rooms}/>
          <Route exact path='/user/data/room' component={Room2}/>
                        </Switch>


                        {/*<Footer />*/}
                       
        </div>
      </BrowserRouter>
      )
    }

  }
 

export default App;


