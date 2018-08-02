import React,{Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import withMobileDialog from '@material-ui/core/withMobileDialog';
// import TextField from '@material-ui/core/TextField';
// import PropTypes from 'prop-types';
// import axios from "axios";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
// import { withStyles } from '@material-ui/core/styles';
// import LoginIn from './LoginButton/Login'
import LoggedIn from './LoggedIn/LoggedIn'
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import { mailFolderListItems, otherMailFolderListItems } from './DataFile';
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
    },list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    homeButton:{
      color:'white'
    },
    signOut:{
      color:'grey'
    }
  };

class Navbar extends Component{
state={
  left: false,
  open:false,
  email:'',
  pass:'',
  anchorEl: null,
  openMenu:false,
  menu:false

}
goToDash=()=>{
  
}
toggleDrawer = (side, open) => () => {
  this.setState({
    [side]: open,
  });
};
toggleMenu = (toggle )=> {
  console.log(toggle)
  this.setState({ menu:true });
};
handleMenuClose = () => {
  this.setState({ menu:false });
};

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
   render(){
    const { anchorEl } = this.state;
    // const { fullScreen } = this.props;
    // importing buttons for the drawer list
const homeLink=(
 <div>
   {this.props.logged? <a href='/dashboard' style={styles.homeButton}> <Typography variant="title" color="inherit" style={styles.flex}>
  GrowAi
</Typography></a>: <a href='/' style={styles.homeButton}> <Typography variant="title" color="inherit" style={styles.flex}>
  GrowAi
</Typography></a>}
</div>
)
  

    const sideList = (
      <div styles={styles.list}>
      {!this.props.logged? <a href='/' >  <ListItem button on>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem> </a>:<a href='/dashboard' >  <ListItem button on>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem> </a>}
     
   <List>{mailFolderListItems}</List>
        <Divider />
        <List >{otherMailFolderListItems}</List>
        {this.props.logged?   <ListItem button style={styles.signOut}>
    <StarIcon />
    <ListItemText style={styles.signOut} onClick={()=>{this.props.logoutfunction()}} primary="Sign Out" />
    </ListItem> :<div/>}
      
      </div>
    );

    // const fullList = (
    //   <div style={styles.fullList}>
       
    //     <Divider />
       
    //   </div>
    //    );
  return (
    <div style={styles.root}>
    <AppBar position="static"  >
    {/* signIn Modal */}
   
   {/* Drawer opens from the left */}
        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList }
          </div>
        </Drawer>
        <Toolbar>
          {/* Icon button top left of screen next to comany name:GrowAI */}
          <IconButton style={styles.menuButton} onClick={this.toggleDrawer('left', true)} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          {/* {CompanyName} top left hand side of screen */}
       {homeLink}
          <Typography variant="title" color="inherit" style={styles.flex}>
       
       
</Typography>

{this.props.logged? <LoggedIn color="inherit" User={this.props.theUser} toggleMenuFunc={this.toggleMenu}  menu={this.state.menu}closeMenuFunction={this.handleMenuClose } anchorel={anchorEl} userdata={this.props.userdata} photoSource={this.props.photoSource}  logout={this.props.logoutfunction} >Login</LoggedIn> : <div />}
      {!this.props.logged?   <Button onClick={this.handleClickOpen} color="inherit">Sign Up</Button>: <div></div>}
        </Toolbar>
      </AppBar>
    </div>
  );

}
}
// Navbar.propTypes = {
//   fullScreen: PropTypes.bool.isRequired,
// };
export default Navbar;