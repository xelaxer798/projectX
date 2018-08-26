// import React from 'react';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import axios from "axios";
import validator from 'validator';


import Dialog from '@material-ui/core/Dialog';


const required = (value) => {
    if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return 'require';
    }
};

const email = (value) => {
    if (!validator.isEmail(value)) {
        return `${value} is not a valid email.`
    }
};



const style = {
    height: 100,
    width: 100,
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
};


const styles = {
    button: {
        margin: 12,
    },
    exampleImageInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
    },
    passwordj: {
        opacity: 0.5,
    },
    h1: {
        fontWeight: 300
    }
};



class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            password: "",
            passwordConfirm: "",
            formErrors: { firstname: "", lastName: "", email: '', address: "", dateOfBirth: "", password: '' },
            emailValid: false,
            firstNameValid: false,
            lastNameValid: false,
            phoneNumberValid: false,
            addressValid: false,
            dateOfBirthValid: false,
            passwordValid: false,
            formValid: false,
            noMatch: true,
            passRequire: true,
            rows: 2,
            countDown: 10,
            OpenModel: false,
            newUserId:''


        }
    }
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        // let firstNameValid = this.state.firstNameValid;
        // let lastNameValid = this.state.lastNameValid;
        // let addressValid = this.state.addressValid;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
                fieldValidationErrors.password = passwordValid ? '' : 'Password is not secure enough';
                break;
            case 'passwordConfirm':
                passwordValid = value.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
                fieldValidationErrors.password = passwordValid ? '' : 'Password is not secure enough';
                break;
            // case 'phoneNumber':
            // phoneNumberValid=value.match('^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$')
            // break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({ formValid: this.state.emailValid && this.state.passwordValid });
    }
    tellPassReg = () => {
        this.setState({
            passRequire: false
        })
    }
    hidePassReq = () => {
        this.setState({
            passRequire: true
        })
    }
    passMatch = () => {
        if (this.state.password != this.state.passwordConfirm) {
            this.setState({
                noMatch: false
            })
        }
        else {
            this.setState({
                noMatch: true
            })
        }

    }

    componentDidMount = () => {

        // this.setState({
        //     countDown:this.state.countDown -1
        // })


    }

    onChange = (e) => {


        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
    }
    passOnChange = (e) => {


        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
            if (this.state.password != this.state.passwordConfirm) {
                this.setState({
                    noMatch: false
                })
            }
            else {
                this.setState({
                    noMatch: true
                })
            }
    }
    // let value = e.target.value;
    // const name = e.target.name;
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

    // if (name === "password") {
    // value = value.substring(0, 15);


  
    imageChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value.split('\\').pop()
        });
        const file = e.target.files[0]



        const dataPic = new FormData();
        dataPic.append('upl', file, file.name);
        console.log(dataPic)
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        axios.post("/api/users/upload", dataPic, config)







    }
    onSubmit = (e) => {

        e.preventDefault();


        if (!this.state.firstName || !this.state.lastName) {

        } else if (this.state.password.length < 6) {

        } else {

        }

        const { firstName, lastName, email, phoneNumber, address,  password } = this.state;

        axios.post('/api/users/new/user', { firstName, lastName, email, phoneNumber, address,  password })
            .then((result) => {
                console.log(result)
                if (result.data == 'already') {
                    alert('There is already an account with that email addres,please try a diffrent one')
                } else {

                    this.setState({
                        OpenModel: true,
                        newUserId:result.data
                    })
                    setInterval(() => this.setState({
                        countDown: this.state.countDown -1
                    })
                        , 1000);

                }
            })

    }
    render() {
        if (this.state.countDown === 0) {
            window.location = '/'
        }
        return (
          <div>

                <Dialog
                    title={`This Window Will Redirect You in: ${this.state.countDown} secounds`}
                    autoDetectWindowHeight={true}
                    className='Dialogue'
                    modal={false}
                    open={this.state.OpenModel}
                    onRequestClose={this.handleClose}
                    style={{ margin: 'auto', maxHeight: '100%' }}
                >
                    <h1> Welcome To Leaf Lift Systems {this.state.firstName}</h1>
                    <h3>This window will close in {this.state.countDown}</h3>
                    <p> {this.state.newUserId}. This is your User Id. It will be in the email confirmation as well. </p>
                    <p> You will recevice a email confirmation in the next few minutes. Please click on the link to confirm your email.</p>
                </Dialog>
                <div styles={{ margin: "auto" }}>

                    {<h1 style={styles.h1}>Create an Account!</h1>}
                    
                </div>
                <div style={{ padding: '20px 0' }}>

                    <div>
                        <TextField
                            name="email"
                            value={this.state.email}
                            label="Email Address"
                            onChange={this.onChange}
                            validations={[required, email]} />
                        <br />
                        <TextField
                            name="firstName"
                            value={this.state.firstName}
                            label="First Name"
                            onChange={this.onChange} />
                        <br />
                        <TextField
                            name="lastName"
                            value={this.state.lastName}
                            label="Last Name"
                            onChange={this.onChange} />
                        <br />
                        <TextField
                            name="address"
                            value={this.state.address}
                            label="Address"
                            onChange={this.onChange} />
                        <br />
                        <TextField
                            name="phoneNumber"
                            value={this.state.phoneNumber}
                            label="Phone Number"
                            onChange={this.onChange} />
                        <br />
                      
                        {!this.state.passRequire &&
                            <p>Passwords must contain at least 6 characters.One letter,one number, and a special character.</p>}

                        <TextField

                            name="password"

                            value={this.state.password}
                            //placeholder="password"

                            label="Password"
                            style={{ textAlign: 'left' }}
                            onBlur={this.hidePassReq}

                            type="password"
                            onClick={this.tellPassReg}
                            // floatingLabelFixed={true}
                            onChange={this.passOnChange}
                        />
                        <br />
                        <TextField
                            name="passwordConfirm"
                            type="password"
                            value={this.state.passwordConfirm}
                            label="Confirm Password"
                            validations={[required]}
                            onChange={this.passOnChange}
                            onMouseOut={this.passMatch} />
                        {!this.state.noMatch &&
                            <p>Your passwords do not match.</p>}

                    </div>
                    <div>
                   
                        <br />
                        <Button onClick={this.onSubmit} disabled={!this.state.formValid} label="Submit!" >Submit</Button>
                    </div>
                </div>
  </div>
        );
    }
}


export default SignUp;
