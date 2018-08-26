import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
// import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import HelpIcon from '@material-ui/icons/Help';

 import ReportIcon from '@material-ui/icons/Store';
import './Datafile.css'
export const mailFolderListItems = (
  <div >
  
   
    
    
  </div>
);

export const otherMailFolderListItems = (
  <div>
    
  
    <a href='/help'>
    <ListItem button>
      <ListItemIcon>
        <HelpIcon />
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