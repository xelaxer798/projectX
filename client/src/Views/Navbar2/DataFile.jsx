import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
// import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
// import ReportIcon from '@material-ui/icons/Report';
import './Datafile.css'
export const mailFolderListItems = (
  <div style={{textDecoration: 'none'}}>
  <a href='/' >  <ListItem button on>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem> </a>
   <a href='/user/rooms'> <ListItem button>
      <ListItemIcon>
        <StarIcon />
      </ListItemIcon>
      <ListItemText  primary="My Rooms" />
    </ListItem></a>
    
    
  </div>
);

export const otherMailFolderListItems = (
  <div>
    
  <a href='/user/account'>  <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="Account"  />
    </ListItem></a>
    <a href='/help'>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Help"/>
    </ListItem></a>
    <a href='/user/rooms'>
    <ListItem button>
    <InboxIcon />
    <ListItemText primary="View One" />
    </ListItem>
    </a>
    <a href='/user/data/room'>
    <ListItem button>
    <StarIcon />
    <ListItemText primary="View All" />
    </ListItem>
    </a>
 

  </div>
);