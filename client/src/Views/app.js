import React, {Component} from 'react';
import { BrowserRouter, Route, Link,Switch } from 'react-router-dom';
import Test from './Home/HomeComponets/Carousel'
import Rooms from './Rooms/Rooms'
import Room2 from './Rooms/Rooms2'
import Home from "./Home/index"
import Navbar from './Navbar2/Navbar'
import './app.scss'
import axios from "axios";
import Dashboard from './DashBoard/DashBoard'

class App extends Component {
  state = {
    logged: false,
    userDataObj: {},
    theId: '',
  } 
  componentDidMount = () => {
    let theuser;
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
            console.log(user)
           
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
                 
                   // console.log(this.state.userDataObj)
                   // console.log(this.state.theId);
               } else {
                 
               }
           })
       }

      
       
  
   }

   logOutHandler = () => {
    this.setState({ logged: false });
    sessionStorage.removeItem('auth');
    localStorage.clear();
    window.location='/'
}
    render(){
        const RoutedDashBoard = (props) => {
            
            return ( 
                <Dashboard
                logged={this.state.logged}
                    component={Dashboard}
                 
                    theUser={this.state.userDataObj}
                    {...props}
                    
                />
            )
        }
      return (
        <BrowserRouter>
        <div className="app">
        {console.log(this.state)}
          <Navbar theUser={this.state.userDataObj} logged={this.state.logged} logoutfunction={this.logOutHandler}>

          </Navbar>
   

          <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/dashboard' render={RoutedDashBoard}/>
          <Route exact path='/user/rooms' component={Rooms}/>
          <Route exact path='/user/data/room' component={Room2}/>
                        </Switch>
      
      
        </div>
      </BrowserRouter>
      )
    }

  }
 

export default App;


