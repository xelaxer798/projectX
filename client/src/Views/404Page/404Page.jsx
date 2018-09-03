import React from 'react';
import { Link } from 'react-router-dom';
import Images from '../../Images/index';

const NotFound = () => (
<div>
<img src={Images.NotFound} alt='404'style={{width: 600, height: 400, display: 'block', margin: 'auto', position: 'relative' }} />
<center><Link to="/">Return to Home Page</Link></center>
</div>
);
export default NotFound;