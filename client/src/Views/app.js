import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
// Link
import Rooms from './Rooms/Rooms';
import Room2 from './Rooms/Rooms2';

import moment from 'moment';
import 'moment-timezone';
import Navbar from './Navbar2/Navbar';
import './app.scss';
import Dashboard from './DashBoard/DashBoard';
import UserPages from './UserPages/index';

import userAPI from '../Data/users-api';
import HelpPages from './Help/index';
// import Grid from '@material-ui/core/Grid';
// import Footer from './Footer/Footer';
class App extends Component {
    state = {
        logged: false,
        userDataObj: {},
        theId: '',
        timezone: '',
        theZone: ''
    }
    getTimezone = (zone) => {
        this.setState({
            theZone: zone
        })
    }
    componentDidMount = async () => {
        var zone = moment.tz.guess();
        if (localStorage.auth != null) {
            // console.log('auth')
            let user = await userAPI.Auth(localStorage.getItem('auth'));
            if (user != null) {
                this.setState({
                    logged: true,
                    userDataObj: {
                        email: user.data.email,
                        profilePic: user.data.profilePic, userId: user.data.id, firstName: user.data.firstName,
                        lastName: user.data.lastName, active: user.data.active, verified: user.data.verified
                    },
                    theId: user.data.id,
                    userCreatedAt: user.data.createdAt,
                })
                // console.log(this.state.userDataObj)
                // console.log(this.state.theId);
            }
        }
        this.getTimezone(zone);
    }
    logOutHandler = () => {
        this.setState({ logged: false });
        localStorage.removeItem('auth');
        window.location = '/'
    }
    render() {
        const RoutedHelpPage = (props) => {
            return (
                <HelpPages.Help
                    logged={this.state.logged}
                    component={HelpPages.Help}
                    userId={this.state.theId}
                    theUser={this.state.userDataObj}
                    {...props}
                />
            )
        }
        const RoutedAccountPage = (props) => {
            return (
                <UserPages.AccountPages.AccountMain
                    logged={this.state.logged}
                    component={UserPages.AccountPages.AccountMain}
                    userId={this.state.theId}
                    theUser={this.state.userDataObj}
                    {...props}
                />
            )
        }
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
                <UserPages.SignIn
                    logged={this.state.logged}
                    component={UserPages.SignIn}
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

                    <p>{this.state.theZone} </p>
                    <Switch>
                        <Route exact path='/' render={() => (
                            !this.state.logged ? (
                                <RoutedHome />

                            ) : (
                                    <Redirect to='/dashboard' />
                                )
                        )} />

                        <Route exact path='/dashboard' render={RoutedDashBoard} />
                        <Route exact path='/user/rooms' userId={this.state.theId} component={Rooms} />
                        <Route exact path='/user/data/room' userId={this.state.theId} component={Room2} />
                        <Route exact path='/signup' component={UserPages.SignUp} />
                        <Route exact path='/user/account' render={RoutedAccountPage} />
                        <Route exact path='/verification/:id' component={UserPages.Verification} />
                        <Route exact path='/reset/:token' component={UserPages.ResetPassword.resetPassword} />
                        <Route exact path='/password/reset' component={UserPages.ResetPassword.recover} />
                        <Route exact path='/email/sent' component={UserPages.ResetPassword.emailSent} />
                        <Route exact path='/change/confirmation' component={UserPages.ResetPassword.confirmation} />
                        <Route exact path='/help' render={RoutedHelpPage} />
                    </Switch>


                    {/*<Footer />*/}

                </div>
            </BrowserRouter>
        )
    }

}


export default App;


