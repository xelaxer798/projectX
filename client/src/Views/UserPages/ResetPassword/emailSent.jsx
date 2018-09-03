import React, { Component } from 'react';
import Button from '@material-ui/core/Button';


class emailSent extends Component {
    state = {
        countDown: 10
    };
    componentDidMount = () => {
        setInterval(this.countDown, 1000);

    };
    countDown = () => {
        this.setState({
            countDown: this.state.countDown - 1
        });
    };

    render() {
        if (this.state.countDown === 0) {
            window.location = '/';
        };
        return (

            <div>
                <h1>This page will redirect you to the home page in {this.state.countDown}</h1>
                We have sent you an email to reset your password. <br />
                Please click the link and reset your password. <br /> Don't forget to check your spam folder.
        <br />

                <br />

            </div>

        );
    };

};
export default emailSent;