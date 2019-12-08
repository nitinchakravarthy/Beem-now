import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundImage from '../404.png';
const NotFound = () => (
<div>
<img src={NotFoundImage} style={{width: 1000, height: 500, display: 'block', margin: 'auto', position: 'relative' }} />
<center><Link to="/">Return to Home Page</Link></center>
</div>
);
export default NotFound;
