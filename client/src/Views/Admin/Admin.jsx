import React, { Component } from 'react';
import Logo from '../../Images/Leaf.png';
import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid';
// import moment from 'moment';
class Admin extends Component {

    componentDidMount = async () => {

    }

    render() {
        return (
            <div className='home' style={{ backgroundColor: 'white' }}>
                <img src={Logo} alt='Logo' />
                <br />    <br />    <br />
                This is the Admin Page {this.props.theUser.firstName} {this.props.theUser.lastName}
                <br/> <br/>
                <Button><a href='/user/most/recent'>
                    View One
    </a></Button>
    <br/><br/>
             <Button> <a href='/user/view/all'>
                    View All
    </a></Button>  
            </div>
        )

    }


} export default Admin;
