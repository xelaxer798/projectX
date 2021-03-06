import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import moment from 'moment';
import 'moment-timezone';
import Navbar from './Navbar2/Navbar';
import './app.scss';
import Dashboard from './DashBoard/DashBoard';
import Dashboard3 from './DashBoard/Dashboard3'
import UserPages from './UserPages/index';
import userAPI from '../Data/users-api';
import HelpPages from './Help/index';
// import Grid from '@material-ui/core/Grid';
import Footer from './Footer/Footer';
import AdminPages from './Admin/index';
import functions from '../Functions/index';
import AlertPages from './UserPages/AlertPages/index'
import NotFound from './404Page/404Page'
import AlertsMain  from "./UserPages/AlertPages/AlertsMain";
import AlertsMain2 from "./UserPages/AlertPages/AlertsMain2";
import AlertsMain3 from "./UserPages/AlertPages/AlertsMain3";
import NodesMain from "./UserPages/NodesPages/NodesMain";
import WebCamsMain from "./UserPages/WebCamPages/WebCamsMain"
import CropsMain from "./UserPages/CropsPages/CropsMain"
import WateringsMain from "./UserPages/WateringsPages/WateringsMain"

class App extends Component {
    state = {
        logged: false,
        userDataObj: {},
        theId: '',
        timezone: '',
        theZone: '',
        footer:false,
       CurrentTime:moment().tz("America/Los_Angeles").format(),
       timeFormated:moment().tz("America/Los_Angeles").format('YYYY-MM-DD hh:mm a')
    };
    getTimezone = (zone) => {
        this.setState({
            timezone: zone
        });
    };
    updateTime=()=>{
    
        this.setState({
            CurrentTime: moment().tz("America/Los_Angeles").format(),
            timeFormated:moment().tz("America/Los_Angeles").format('YYYY-MM-DD hh:mm a')
        });
    };
    componentDidMount = async () => {
     
       
        const url = window.location.toString().split('/');
      
        if(url[3] !==''){
            this.setState({
                footer:true
            });
        };
        var zone = moment.tz.guess();
        if (localStorage.auth != null) {
            // console.log('auth')
            let user = await userAPI.Auth(localStorage.getItem('auth'));
            if (user != null) {
            // console.log(user)
                this.setState({
                    logged: true,
                    userDataObj: {
                        email: user.data.email,
                        profilePic: user.data.profilePic, userId: user.data.id, firstName: user.data.firstName,
                        lastName: user.data.lastName, inactive: user.data.inactive, verified: user.data.verified,
                        subscription:user.data.subscription
                    },
                    theId: user.data.id,
                    userCreatedAt: user.data.createdAt,
                });
                // console.log(this.state.userDataObj)
                // console.log(this.state.theId);
            };
        } ;
        this.getTimezone(zone);
        // setInterval(this.updateTime,60000)
    };
    logOutHandler = () => {
        this.setState({ logged: false });
        localStorage.removeItem('auth');
        window.location = '/'
    };
    render() {
        const RoutedAdminPage = (props) => {
            return (
                <AdminPages.Admin
                    logged={this.state.logged}
                    component={AdminPages.Admin}
                    userId={this.state.theId}
                    theUser={this.state.userDataObj}
                    {...props}
                />
            );
        };
        const RoutedAlertsPage = (props) => {
            return (
                <AlertsMain3
                    logged={this.state.logged}
                    component={AlertPages.AlertsMain3}
                    userId={this.state.theId}
                    theUser={this.state.userDataObj}
                    {...props}
                />
            );
        };
        const RoutedNodesPage = (props) => {
            return (
                <NodesMain/>
            )
        };

        const RoutedCropsPage = (props) => {
            return (
                <CropsMain/>
            )
        };

        const RoutedWateringsPage = (props) => {
            return (
                <WateringsMain/>
            )
        };

        const RoutedWebCamsPage = (props) => {
            return (
                <WebCamsMain/>
            )
        };

        const RoutedHelpPage = (props) => {
            return (
                <HelpPages.Help
                    logged={this.state.logged}
                    component={HelpPages.Help}
                    userId={this.state.theId}
                    theUser={this.state.userDataObj}
                    {...props}
                />
            );
        };
        const RoutedAccountPage = (props) => {
            return (
                <UserPages.AccountPages.AccountMain
                    logged={this.state.logged}
                    component={UserPages.AccountPages.AccountMain}
                    userId={this.state.theId}
                    theUser={this.state.userDataObj}
                    {...props}
                />
            );
        };
        const RoutedDashBoard = (props) => {

            return (
                <Dashboard
     
                    logged={this.state.logged}
                    component={Dashboard3}
                    userId={this.state.theId}
                    theUser={this.state.userDataObj}
                    {...props}
                />
            );
        };
        const RoutedDashBoard3 = (props) => {

            return (
                <Dashboard3

                    logged={this.state.logged}
                    component={Dashboard3}
                    userId={this.state.theId}
                    theUser={this.state.userDataObj}
                    {...props}
                />
            );
        };
        const RoutedHome = (props) => {
            return (
                <UserPages.SignIn
               
                    logged={this.state.logged}
                    component={UserPages.SignIn}
                    theUser={this.state.userDataObj}
                    {...props}
                />
            );
        };
        return (
            <BrowserRouter>

                <div className="app">

                    <Navbar theUser={this.state.userDataObj} logged={this.state.logged} logoutfunction={this.logOutHandler}>

                    </Navbar>

                    <Switch>
                        <Route exact path='/' render={() => (
                            !this.state.logged ? (
                                <RoutedHome />

                            ) : (
                                    <Redirect to='/dashboard' />
                                )
                        )} />

                        <Route exact path='/dashboard' render={RoutedDashBoard3} />
                        <Route exact path='/dashboard3' render={RoutedDashBoard3} />
                        <Route exact path='/user/view/all'component={AdminPages.AdminData.ViewAll} />
                        <Route exact path='/user/most/recent'  component={AdminPages.AdminData.MostRecent} />
                        <Route exact path='/signup' component={UserPages.SignUp} />
                        <Route exact path='/user/account' render={RoutedAccountPage} />
                        <Route exact path='/alerts' render={RoutedAlertsPage} />
                        <Route exact path='/nodes' render={RoutedNodesPage} />
                        <Route exact path='/waterings' render={RoutedWateringsPage} />
                        <Route exact path='/crops' render={RoutedCropsPage} />
                        <Route exact path='/webCams' render={RoutedWebCamsPage} />
                        <Route exact path='/verification/:id' component={UserPages.Verification} />
                        <Route exact path='/reset/:token' component={UserPages.ResetPassword.resetPassword} />
                        <Route exact path='/password/reset' component={UserPages.ResetPassword.recover} />
                        <Route exact path='/email/sent' component={UserPages.ResetPassword.emailSent} />
                        <Route exact path='/change/confirmation' component={UserPages.ResetPassword.confirmation} />
                        <Route exact path='/help' render={RoutedHelpPage} />
                        <Route exact path='/admin' render={RoutedAdminPage}/>
                        <Route path="*" component={NotFound} />
                    </Switch>


          <Footer />

                </div>
            </BrowserRouter>
        );
    };

};


export default App;


