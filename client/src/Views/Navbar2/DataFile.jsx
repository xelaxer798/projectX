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

export const mailFolderListItems = (
  <div>
    <ListItem button on>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText onClick={()=>{window.location='/'}} primary="Home" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <StarIcon />
      </ListItemIcon>
      <ListItemText onClick={()=>{window.location='/user/rooms'}} primary="My Rooms" />
    </ListItem>
    
    <ListItem button>
      <ListItemIcon>
        <DraftsIcon />
      </ListItemIcon>
      <ListItemText primary="My Data" />
    </ListItem>
  </div>
);

export const otherMailFolderListItems = (
  <div>
    
    <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="Account" onClick={()=>{window.location='/user/account'}} />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Help" onClick={()=>{window.location='/help'}}/>
    </ListItem>
    <ListItem button>
    <InboxIcon />
    <ListItemText onClick={()=>{window.location='/user/rooms'}} primary="View One" />
    </ListItem>
    <ListItem button>
    <StarIcon />
    <ListItemText onClick={()=>{window.location='/user/data/room'}} primary="View All" />
    </ListItem>
 

  </div>
);