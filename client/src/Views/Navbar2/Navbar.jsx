import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import withMobileDialog from '@material-ui/core/withMobileDialog';
// import TextField from '@material-ui/core/TextField';
// import PropTypes from 'prop-types';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
// import { withStyles } from '@material-ui/core/styles';
// import LoginIn from './LoginButton/Login';
import HomeIcon from '@material-ui/icons/Home'
import DashboardIcon from '@material-ui/icons/Dashboard';
import SignOutIcon from '@material-ui/icons/ExitToApp'
import LoggedIn from './LoggedIn/LoggedIn';
import RoomIcon from '../../Images/roomIcon2.png';
import SettingsIcon from '@material-ui/icons/SettingsApplications';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star'
import {otherMailFolderListItems} from './DataFile';
import LeafLiftLogo from "../../Images/Leaf.png";
import TheProfessorLogo from "../../Images/TheProfessorLogo.png"
import PlateLinguisticsLogo from"../../Images/PlateLinguisticsLogo.png"
import {Col, Container, Row} from 'react-grid-system';
import moment from "moment";
import functions from "../../Functions";


const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
        cursor: 'pointer'
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    }, list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    homeButton: {
        color: 'white'
    },
    signOut: {
        color: 'grey'
    }
};

class Navbar extends Component {
    state = {
        left: false,
        open: false,
        email: '',
        pass: '',
        anchorEl: null,
        openMenu: false,
        menu: false,
        admin: false,
        CurrentTime: moment().format(),
        timeFormated: functions.getDashboardFormateTime('dont'),

    };
    componentDidMount = () => {
        if (this.props.theUser.subscription === 'admin') {
            this.setState({
                admin: true
            });
        }
        setInterval(this.updateTime, 1000);

    };
    updateTime = () => {
        this.setState({
            CurrentTime: moment().format(),
            timeFormated: functions.getDashboardFormateTime('dont')
        });
    };

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };
    toggleMenu = (toggle) => {

        this.setState({menu: true});
    };
    handleMenuClose = () => {
        this.setState({menu: false});
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    componentDidCatch = (error, info) => {
        console.log(error, 'hi im errors at navbarE');
        console.log(info, 'hi im info at navbarE');
    };

    render() {
        let admin = null;

        if (this.props.theUser.subscription === 'admin') {
            admin = <a href='/admin'> <ListItem button>
                <ListItemIcon>
                    <SettingsIcon/>
                </ListItemIcon>
                <ListItemText primary="Admin"/>
            </ListItem></a>
        }
        else {
            admin = <div/>
        }
        ;
        const {anchorEl} = this.state;
        // const { fullScreen } = this.props;
        // importing buttons for the drawer list
        const homeLink = (
            <div>
                {this.props.logged ?
                    <div>
                        <Row align="center">
                            <Col lg={3}>
                                <a href='http://leafliftsystems.com/' target="_blank" style={styles.homeButton}>
                                    <img src={LeafLiftLogo} width="175" alt='Leaf Lift Logo'/>
                                </a>
                            </Col>
                            <Col lg={3}>
                                <a href='http://leafliftsystems.com/the-professor-about/' target="_blank" style={styles.homeButton}>
                                    <img src={TheProfessorLogo} width="200" alt='The Professor Logo'/>
                                </a>
                            </Col>
                            <Col lg={3}>
                                <a href='http://www.platelinguistics.com/' target="_blank" style={styles.homeButton}>
                                    <img src={PlateLinguisticsLogo} width="200" alt='Plate Linguistics Logo'/>
                                </a>
                            </Col>
                            <Col lg={3}>
                                {this.state.timeFormated}
                            </Col>

                        </Row>
                    </div>
                    :
                    <a href='/' style={styles.homeButton}> <Typography variant="title" color="inherit"
                                                                       style={styles.flex}>
                        Leaf Lift Systems
                    </Typography></a>}
            </div>
        );

        const sideList = (
            <div styles={styles.list}>
                {!this.props.logged ? <a href='/'> <ListItem button>
                    <ListItemIcon>
                        <HomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Home"/>
                </ListItem> </a> : <a href='/dashboard'> <ListItem button>
                    <ListItemIcon>
                        <DashboardIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Dashboard"/>
                </ListItem> </a>}
                {this.props.logged ? <a href='/user/rooms'> <ListItem button>
                    <ListItemIcon>
                        <img width={25} src={RoomIcon} color={'grey'} alt='room'/>
                    </ListItemIcon>
                    <ListItemText style={{color: 'black'}} primary="My Rooms"/>
                </ListItem></a> : <div/>}
                {this.props.logged ? <Divider/> : <div/>}

                {this.props.logged ? <a href='/alerts'> <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Alerts"/>
                </ListItem></a> : <div/>}

                {this.props.logged ? <a href='/webCams'> <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Web Cams"/>
                </ListItem></a> : <div/>}

                {this.props.logged ? <a href='/nodes'> <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Nodes"/>
                </ListItem></a> : <div/>}

                {this.props.logged ? <a href='/crops'> <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Crops"/>
                </ListItem></a> : <div/>}

                {this.props.logged ? <a href='/waterings'> <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Waterings"/>
                </ListItem></a> : <div/>}

                {this.props.logged ? <a href='/user/account'> <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Account"/>
                </ListItem></a> : <div/>}

                <List>{otherMailFolderListItems}</List>
                {admin}
                {this.props.logged ? <ListItem button style={styles.signOut}>
                    <SignOutIcon/>
                    <ListItemText style={styles.signOut} onClick={() => {
                        this.props.logoutfunction()
                    }} primary="Sign Out"/>
                </ListItem> : <div/>}

            </div>
        );


        return (
            <div >
                <AppBar position="static" color="default">
                    {/* signIn Modal */}

                    {/* Drawer opens from the left */}
                    <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                        <div
                            tabIndex={0}
                            role="button"
                            onClick={this.toggleDrawer('left', false)}
                            onKeyDown={this.toggleDrawer('left', false)}
                        >
                            {sideList}
                        </div>
                    </Drawer>
                    <Toolbar>
                        {/* Icon button top left of screen next to comany name:GrowAI */}
                        <IconButton style={styles.menuButton} onClick={this.toggleDrawer('left', true)} color="inherit"
                                    aria-label="Menu">
                            <MenuIcon/>
                        </IconButton>
                        {/* {CompanyName} top left hand side of screen */}
                        {homeLink}
                        <Typography variant="title" color="secondary" style={styles.flex}>


                        </Typography>

                        {this.props.logged ?
                            <LoggedIn color="black" User={this.props.theUser} toggleMenuFunc={this.toggleMenu}
                                      menu={this.state.menu} closeMenuFunction={this.handleMenuClose}
                                      anchorel={anchorEl} userdata={this.props.userdata}
                                      photoSource={this.props.photoSource}
                                      logout={this.props.logoutfunction}>Login</LoggedIn> : <div/>}
                        {/*{!this.props.logged ?*/}
                            {/*<a href='/signup'> <Button style={{color: 'blue'}}>Sign Up</Button> </a> : <div></div>}*/}
                    </Toolbar>
                </AppBar>
            </div>
        );

    };
};
// Navbar.propTypes = {
//   fullScreen: PropTypes.bool.isRequired,
// };
export default Navbar;