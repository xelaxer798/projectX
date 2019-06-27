import React, {Component} from 'react';
import Modal from 'react-modal';
import Form from "react-validation/build/form";
import Select from "react-validation/build/select";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import AlertsApi from "../../../Data/alerts-api";
import {isEmail} from "validator";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, {Type} from "react-bootstrap-table2-editor";
import moment from "moment";
import CircularJSON from 'circular-json'
import EditAlertUserModal from "./EditAlertUserModal"

class EditAlertModal extends Component {

    constructor(props) {
        super(props);
        console.log("Edit alert modal props: " + JSON.stringify(props));
        this.state = {
            selectedAlert: props.selectedAlert,
            nodes: props.nodes,
            sensors: props.sensors,
            newRecord: props.newRecord,
            users: [],
            selected: [],
            selectedUser: this.blankAlertUser,
            newUserRecord: {},
            modalIsOpen: false
        }

    }

    blankAlertUser = {
        AlertUsers: {
            userId: "",
            notificationMethod: "",
            notificationInterval: 0,
            active: false
        }
     };


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
        this.setState(nextProps);
    }

    closeAlertUserModal = ()  =>{
        this.setState({
            modalIsOpen: false
        });
    }


    isInputGroupHidden = (groupType) => {
        console.log("Edit modal dialog state: " + JSON.stringify(this.state.selectedAlert.alertType))
        console.log("Edit modal dialog groupType: " + groupType)
        if (this.state.selectedAlert.alertType === groupType) {
            return false;
        } else {
            return true;
        }
    };

    handleAlertTypeDropdown = (event) => {
        let selectedAlert = this.props.selectedAlert;
        selectedAlert.alertType = event.target.value;
        this.setState({
            selectedAlert: selectedAlert
        })
    };

    requiredSensorAlert = (value, props) => {
        // console.log("In required sensor alert - value: " +  value + " Props: " + props);
        if (this.state.selectedAlert.alertType === "Sensor") {
            if (!value || (props.isCheckable && !props.checked)) {
                return <span className="form-error is-visible">Required</span>;
            }
        }
    };

    requiredNodeAlert = (value, props) => {
        // console.log("In required sensor alert - value: " +  value + " Props: " + props);
        if (this.state.selectedAlert.alertType === "Node") {
            if (!value || (props.isCheckable && !props.checked)) {
                return <span className="form-error is-visible">Required</span>;
            }
        }
    };

    requiredWateringAlert = (value, props) => {
        // console.log("In required sensor alert - value: " +  value + " Props: " + props);
        if (this.state.selectedAlert.alertType === "Watering") {
            if (!value || (props.isCheckable && !props.checked)) {
                return <span className="form-error is-visible">Required</span>;
            }
        }
    };

    handleCheckboxClick = (event) => {
        let selectedAlert = this.state.selectedAlert;
        selectedAlert.active = event.target.checked;
        this.setState({
            selectedAlert: selectedAlert
        });

    };

    required = (value, props) => {
        // console.log("In required - value: " + value + " Props: " + CircularJSON.stringify(props));
        if (!value || (props.isCheckable && !props.checked)) {
            return <span className="form-error is-visible">Required</span>;
        }
    };

    isRelative = (value, props, components) => {
        // console.log("Components: " + JSON.stringify(components))
        const bothUsed = components.highValue[0].isUsed && components.lowValue[0].isUsed;
        const bothChanged = components.highValue[0].isChanged && components.lowValue[0].isChanged;

        if (bothChanged && bothUsed && parseInt(components.lowValue[0].value) > parseInt(components.highValue[0].value)) {
            return <span className="form-error is-visible">Low value must be below high value.</span>;
        }
    };

    email = (value) => {
        if (!isEmail(value)) {
            return <span className="form-error is-visible">${value} is not a valid email.</span>;
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
            let newAlert = Object.assign(this.state.selectedAlert, this.form.getValues());
            newAlert.active = this.state.selectedAlert.active;
            newAlert.status = "a-ok";
            this.removeUnusedProperties(newAlert);
            console.log("New alert: " + JSON.stringify(newAlert));
            this.props.handleAlertFromModal(newAlert);
        } else {
            console.log("handleSubmitEditAlertModal from state: " + JSON.stringify(this.state.selectedAlert))
            console.log("handleSubmitEditAlertModal from form: " + JSON.stringify(this.form.getValues()))
            let updatedAlert = Object.assign(this.state.selectedAlert, this.form.getValues());
            console.log("handleSubmitEditAlertModal: " + JSON.stringify(updatedAlert))
            updatedAlert.active = this.state.selectedAlert.active;
            console.log("handleSubmitEditAlertModal after: " + JSON.stringify(updatedAlert))
            this.removeUnusedProperties(updatedAlert);
            console.log("Updated alert: " + JSON.stringify(updatedAlert));
            this.props.handleAlertFromModal(updatedAlert);
        }
    };

    checkBoxFormatter = (cell, row) => {
        if (row.AlertUsers.active) {
            return ("︎︎✅");
        } else {
            return ("︎❌");
        }
    }

    dateFormatter = (cell, row) => {
        if (row.AlertUsers.lastNotification) {
            return moment(row.AlertUsers.lastNotification).format('M/D/YY h:mm A z');
        } else {
            return "";
        }

    };

    handleCheckboxRowActiveClick = (event) => {
        let selectedAlert = this.state.selectedAlert.Users;
        selectedAlert.active = event.target.checked;
        this.setState({
            selectedAlert: selectedAlert
        });

    };

    handleUserFromModal = () => {
        this.setState({
            modalIsOpen: false
        });
        console.log("handleUserFromModal selectedAlert: " + JSON.stringify(this.state.selectedAlert))
        console.log("handleUserFromModal selectedUser: " + JSON.stringify(this.state.selectedUser))

    }

    newAlertUser = () => {
        console.log("New Alert User");
    }

    deleteAlertUser = () => {
        console.log("Delete Alert User");
    }

    selectRow = () => {
        return {
            mode: 'checkbox',
            clickToSelect: true,
        }
    };

    rowEvents = {
        onDoubleClick: (e, row, rowIndex) => {
            // console.log("e: " + JSON.stringify(e));
            console.log("row: " + JSON.stringify(row));
            console.log("rowIndex: " + rowIndex);
            this.editRecord(row.userId);
        }

    };

    editRecord(userId) {
        const selectedUser = this.state.selectedAlert.Users.find((user) => {
            return (user.userId === userId)
        });
        console.log("Selected user: " + JSON.stringify(selectedUser));
        this.setState({
            selectedUser: selectedUser,
            newRecord: false,
            modalIsOpen: true,
        });
        // this.openModal();
    }


    renderColumns = () => {
        return [{
            dataField: 'userId',
            text: 'User ID',
            sort: true,
            editable: false,
            hidden: false,
        }, {
            dataField: 'firstName',
            text: 'First Name',
            sort: true,
            editable: false,
            hidden: false,
        }, {
            dataField: 'lastName',
            text: 'Last Name',
            sort: true,
            hidden: false,
            editable: true,
        }, {
            dataField: 'AlertUsers.notificationMethod',
            text: 'Notification Method',
            sort: true,
            hidden: false,
            editable: true,
        }, {
            dataField: 'AlertUsers.notificationInterval',
            text: 'Notification Interval',
            sort: true,
            hidden: false,
        }, {
            dataField: 'AlertUsers.lastNotification',
            text: 'Last Notification',
            sort: true,
            hidden: false,
            editable: false,
            formatter: this.dateFormatter
        }, {
            dataField: 'AlertUsers.active',
            text: 'Active',
            sort: true,
            hidden: false,
            formatter: this.checkBoxFormatter,
        }
        ];

    };

    render() {
        console.log ("Selected alert from props: " + JSON.stringify(this.props.selectedAlert));
        console.log ("Selected alert from state: " + JSON.stringify(this.state.selectedAlert));
        return (
            <div>
                <EditAlertUserModal
                    isOpen={this.state.modalIsOpen}
                    selectedUser = {this.state.selectedUser}
                    closeModal = {this.closeAlertUserModal}
                    users={this.state.users}
                    newRecord={this.state.newRecord}
                    users={this.state.users}
                    handleUserFromModal={this.handleUserFromModal}


                />
                <Modal
                    isOpen={this.props.isOpen}
                    ariaHideApp={false}
                    onRequestClose={this.props.closeModal}
                    contentLabel="Example Modal">This is a test
                    <Form ref={c => {
                        this.form = c
                    }} onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="small-12 medium-4 columns">
                                Alert Type
                                <Select name="alertType"
                                        value={this.state.selectedAlert.alertType}
                                        onChange={this.handleAlertTypeDropdown}
                                        validations={[this.required]}>
                                    <option value=''>Alert Type</option>
                                    <option key="Sensor" value="Sensor">Sensor</option>
                                    <option key="Node" value="Node">Node</option>
                                    <option key="Watering" value="Watering">Watering</option>
                                </Select>
                            </div>
                            <div className="small-12 medium-4 columns">
                                <label>
                                    Alert Name*
                                    <Input
                                        placeholder="Alert Name"
                                        type="text"
                                        name="alertName"
                                        value={this.state.selectedAlert.alertName}
                                        validations={[this.requiredSensorAlert]}
                                    />
                                </label>
                            </div>
                            <div className="small-12 medium-2 columns">
                                <label>
                                    Status
                                    <Input
                                        placeholder="Status"
                                        type="text"
                                        disabled="true"
                                        value={this.state.selectedAlert.status}
                                        name="status"
                                    />
                                </label>
                            </div>
                            <div className="small-12 medium-2 columns">
                                <label>
                                    Active
                                    <Input
                                        type="checkbox"
                                        name="alertActive"
                                        // value="true"
                                        checked={this.state.selectedAlert.active}
                                        // ref={active => this.active = active}
                                        onChange={this.handleCheckboxClick}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="row" hidden={this.isInputGroupHidden("Sensor")}>
                            <div className="small-12 medium-4 columns">
                                <label>
                                    Sensor
                                    <Select name='sensorId' value={this.state.selectedAlert.sensorId || ""}
                                            validations={[this.requiredSensorAlert]}>
                                        <option value=''>Choose a sensor</option>
                                        {this.state.sensors.map(sensor => {
                                            return (
                                                <option
                                                    key={sensor.value}
                                                    value={sensor.value}>{sensor.label}</option>

                                            )

                                        })}
                                    </Select>
                                </label>
                            </div>
                            <div className="small-12 medium-2 columns">
                                <label>
                                    High Value*
                                    <Input
                                        type="number"
                                        name="highValue"
                                        value={this.state.selectedAlert.highValue}
                                        validations={[this.requiredSensorAlert, this.isRelative]}
                                    />
                                </label>
                            </div>
                            <div className="small-12 medium-2 columns">
                                <label>
                                    Low Value*
                                    <Input
                                        type="number"
                                        name="lowValue"
                                        value={this.state.selectedAlert.lowValue}
                                        validations={[this.requiredSensorAlert, this.isRelative]}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="row" hidden={this.isInputGroupHidden("Node")}>
                            <div className="small-12 medium-4 columns">
                                <label>
                                    Node
                                    <Select name='nodeId' value={this.state.selectedAlert.nodeId || ""}
                                            validations={[this.requiredNodeAlert]}>
                                        <option value=''>Choose a node</option>
                                        {this.state.nodes.map(node => {
                                            return (
                                                <option
                                                    key={node.value}
                                                    value={node.value}>{node.label}</option>

                                            )

                                        })}
                                    </Select>
                                </label>
                            </div>
                            <div className="small-12 medium-3 columns">
                                <label>
                                    Node Non-Reporting Time Limit*
                                    <Input
                                        type="number"
                                        name="nodeNonReportingTimeLimit"
                                        value={this.state.selectedAlert.nodeNonReportingTimeLimit}
                                        validations={[this.requiredNodeAlert]}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="row" hidden={this.isInputGroupHidden("Watering")}>
                            <div className="small-12 medium-4 columns">
                                <label>
                                    Sensor
                                    <Select name='sensorIdWatering' value={this.state.selectedAlert.sensorId || ""}
                                            validations={[this.requiredWateringAlert]}>
                                        <option value=''>Choose a sensor</option>
                                        {this.state.sensors.map(sensor => {
                                            if (sensor.value.includes("FlowEvent")) {
                                                return (
                                                    <option
                                                        key={sensor.value}
                                                        value={sensor.value}>{sensor.label}</option>

                                                )
                                            }

                                        })}
                                    </Select>
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="small-3 medium-2 columns">
                                <button className="btn btn-primary btn-sm" type="button" onClick={this.newAlertUser}>New
                                    Alert Subscription
                                </button>
                            </div>
                            <div className="small-3 medium-2 columns">
                                <button className="btn btn-primary btn-sm" type="button"
                                        onClick={this.deleteAlertUser}>Delete Alert Subscriptionl
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <BootstrapTable
                                ref={n => this.node = n}
                                data={this.state.selectedAlert.Users}
                                striped={true}
                                condensed={true}
                                defaultSorted={this.defaultSorted}
                                bootstrap4={true}
                                classes="table-class"
                                keyField='userId'
                                selectRow={this.selectRow()}
                                rowEvents={this.rowEvents}
                                columns={this.renderColumns()}/>
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

export default EditAlertModal;