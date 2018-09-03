import React from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../../Images/404.jpg';

const NotFound = () => (
<div>
<img src={PageNotFound} alt='404'style={{width: 600, height: 400, display: 'block', margin: 'auto', position: 'relative' }} />
<center><Link to="/">Return to Home Page</Link></center>
</div>
);
export default NotFound;