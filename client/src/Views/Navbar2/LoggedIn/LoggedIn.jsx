import React from 'react';
// import IconButton from 'material-ui/IconButton';
// import IconMenu from 'material-ui/IconMenu';
// import VertIcon from './more_vert_white_24x24.png'
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
// import SvgIcon from '@material-ui/core/SvgIcon';
// import Avatar from 'material-ui/Avatar';
// import Link from 'react-router-dom';



const loggedIn = (props) => {
  let {logout, ...newProps} = props;
  props = newProps;

  return (
   <div>
    
       {/* <Button  onClick={() => { props.toggleMenuFunc() }}> <svg xmlns={VertIcon} width="18" height="18" viewBox="0 0 18 18"><path d="M9 5.5c.83 0 1.5-.67 1.5-1.5S9.83 2.5 9 2.5 7.5 3.17 7.5 4 8.17 5.5 9 5.5zm0 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S9.83 7.5 9 7.5zm0 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
      </svg></Button> */}
      <a href='/dashboard' ><Button style={{color:'purple'}}> {props.User.firstName} {props.User.lastName}</Button> </a>
  
  
  </div>
)
};

loggedIn.muiName = 'Button';

export default loggedIn;