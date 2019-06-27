import React, {Component} from 'react';
import Modal from 'react-modal';
import Form from "react-validation/build/form";
import Select from "react-validation/build/select";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import AlertsApi from "../../../Data/alerts-api";

class EditAlertUserModal extends Component {

    constructor(props) {
        super(props);
        console.log("Edit alert modal props: " + JSON.stringify(props));
        this.state = {
            selectedUser: props.selectedUser,
            nodes: props.nodes,
            sensors: props.sensors,
            newRecord: props.newRecord,
            users: props.users,
        }

    }

    removeUnusedProperties = (alert) => {
        if (alert.alertType === "Sensor") {
            delete alert.nodeNonReportingTimeLimit;
            delete alert.nodeId
        } else if (alert.alertType === "Node") {
            delete alert.highValue;
            delete alert.lowValue;
            delete alert.sensorId;
        } else if (alert.alertType === "Watering") {
            delete alert.nodeNonReportingTimeLimit;
            delete alert.highValue;
            delete alert.lowValue;
            delete alert.nodeId;
            alert.sensorId = alert.sensorIdWatering;
            delete alert.sensorIdWatering;
        }
    };


    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps: ' + JSON.stringify(nextProps));
        console.log("Original user: " + JSON.stringify(nextProps.selectedUser));
        this.setState(nextProps);
    }


    handleUsersDropdown = (event) => {
        let selectedUser = this.state.selectedUser;
        selectedUser.AlertUsers.UserUserId = event.target.value;
        this.setState({
            selectedUser: selectedUser
        })
    };

    handleCheckboxClick = (event) => {
        let selectedUser = this.state.selectedUser;
        selectedUser.AlertUsers.active = event.target.checked;
        this.setState({
            selectedUser: selectedUser
        });

    };

    required = (value, props) => {
        // console.log("In required - value: " + value + " Props: " + CircularJSON.stringify(props));
        if (!value || (props.isCheckable && !props.checked)) {
            return <span className="form-error is-visible">Required</span>;
        }
    };

    isEqual = (value, props, components) => {
        const bothUsed = components.password[0].isUsed && components.confirm[0].isUsed;
        const bothChanged = components.password[0].isChanged && components.confirm[0].isChanged;

        if (bothChanged && bothUsed && components.password[0].value !== components.confirm[0].value) {
            return <span className="form-error is-visible">Passwords are not equal.</span>;
        }
    };


    handleClick = () => {
        this.form.validateAll();
    };

    handleSubmit = (event) => {
        event.preventDefault();


        if (this.state.newRecord) {
            let newAlert = Object.assign(this.state.selectedUser, this.form.getValues());
            newAlert.active = this.state.selectedUser.active;
            newAlert.status = "a-ok";
            this.removeUnusedProperties(newAlert);
            console.log("New alert: " + JSON.stringify(newAlert));
            this.props.handleAlertFromModal(newAlert);
        } else {
            let updatedAlertUser = Object.assign(this.state.selectedUser.AlertUsers, this.form.getValues());
            updatedAlertUser.active = this.state.selectedUser.AlertUsers.active;
            // this.removeUnusedProperties(updatedAlertUser);
            console.log("handleSubmitEditAlertUserModal from form: " + JSON.stringify(this.form.getValues()))
            console.log("Updated alert user: " + JSON.stringify(updatedAlertUser));
            console.log("original  user: " + JSON.stringify(this.props.selectedUser));
            this.props.handleUserFromModal();
        }
    };


    render() {
        console.log("Selected alert from props: " + JSON.stringify(this.props.selectedUser));
        console.log("Selected alert from state: " + JSON.stringify(this.state.selectedUser));
        console.log("isOpen open from props: " + JSON.stringify(this.props.isOpen));
        var modalStyles = {overlay: {zIndex: 10}};
        return (

        <div>
                <Modal
                    isOpen={this.props.isOpen}
                    style={modalStyles}
                    ariaHideApp={false}
                    onRequestClose={this.props.closeModal}>
                    <Form ref={c => {
                        this.form = c
                    }} onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="small-12 medium-4 columns">
                                User
                                <Select name="userId"
                                        value={this.state.selectedUser.AlertUsers.UserUserId}
                                        onChange={this.handleUsersDropdown}
                                        validations={[this.required]}>
                                    <option value=''>Choose a user</option>
                                    {this.state.users.map(user => {
                                        return (
                                            <option
                                                key={user.value}
                                                value={user.value}>{user.label}</option>

                                        )

                                    })}
                                </Select>
                            </div>
                            <div className="small-12 medium-4 columns">
                                <label>
                                    Notification Method
                                    <Input
                                        placeholder="Notification Method"
                                        type="text"
                                        name="notificationMethod"
                                        value={this.state.selectedUser.AlertUsers.notificationMethod}
                                        validations={[this.required]}
                                    />
                                </label>
                            </div>
                            <div className="small-12 medium-2 columns">
                                <label>
                                    Notification Interval
                                    <Input
                                        placeholder="Notification Interval"
                                        type="number"
                                         value={this.state.selectedUser.AlertUsers.notificationInterval}
                                        name="notificationInterval"
                                    />
                                </label>
                            </div>
                            <div className="small-12 medium-2 columns">
                                <label>
                                    Active
                                    <Input
                                        type="checkbox"
                                        name="alertUsersActive"
                                        // value="true"
                                        checked={this.state.selectedUser.AlertUsers.active}
                                        // ref={active => this.active = active}
                                        onChange={this.handleCheckboxClick}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="small-3 medium-2 columns">
                                <Button className="btn btn-primary">Submit</Button>
                            </div>
                            <div className="small-3 medium-2 columns">
                                <button className="btn btn-danger" type="button" onClick={this.props.closeModal}>Cancel
                                </button>
                            </div>
                            <div className="small-3 medium-2 columns">
                                <button className="btn btn-primary" type="button" onClick={this.handleClick}>Validate
                                    all
                                </button>
                            </div>
                        </div>
                    </Form>

                </Modal>

            </div>

        )
    }
}

export default EditAlertUserModal;