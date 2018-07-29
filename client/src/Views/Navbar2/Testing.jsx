import React from 'react';
// import IconButton from 'material-ui/IconButton';
// import IconMenu from 'material-ui/IconMenu';

import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';

const Signout = (props) => {
  let {logout, ...newProps} = props;
  props = newProps;
console.log(props)
  return (
   <div>
    <ListItem button>
    <StarIcon />
    <ListItemText onClick={()=>{}} primary="Sign Out" />
    </ListItem>
  </div>
)
};



export default Signout;