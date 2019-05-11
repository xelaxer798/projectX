import React, {Component} from 'react';
import AlertsApi from '../../../Data/alerts-api'
import SensorApi from '../../../Data/sensor-api'
import NodeApi from '../../../Data/nodes-api'
import Images from "../../../Images";
import BootstrapTable from 'react-bootstrap-table-next';
import './AlertsMain.css'
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor';
import Modal from 'react-modal';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button'
import {isEmail} from 'validator';
import './foundation-flex.css';
import EditAlertModal from './EditAlertModal'
import Constants from "../../DashBoard/Constants";
import moment from 'moment';

class AlertsMain3 extends Component {

    constructor(props) {
        super(props);
        let height = 400;

        this.state = {
            isLoading: false,
            alerts: [],
            modalIsOpen: false,
            modal2IsOpen: false,
            tableHeight: height + "px",
            selectedAlert: this.blankAlert,
            sensors: [],
            nodes: []
        };
        this.newRecord = this.newRecord.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isRelative = this.isRelative.bind(this);
        this.editRecord = this.editRecord.bind(this);
        AlertsMain3.renderColumns = AlertsMain3.renderColumns.bind(this);
        this.editRecord = this.editRecord.bind(this);
        AlertsMain3.setStatusColor = AlertsMain3.setStatusColor.bind(this);
        this.newRecord2 = this.newRecord2.bind(this);
        this.closeModal2 = this.closeModal2.bind(this);
        this.required = this.required.bind(this);
        this.requiredSensorAlert = this.requiredSensorAlert.bind(this);
        this.requiredNodeAlert = this.requiredNodeAlert.bind(this);
        this.isInputGroupHidden = this.isInputGroupHidden.bind(this);
        this.handleAlertTypeDropdown = this.handleAlertTypeDropdown.bind(this);
        this.getAlerts = this.getAlerts.bind(this);

        document.title = "Project X - Alerts"

    }

    blankAlert = {
        alertName: "",
        highValue: 0,
        lowValue: 0,
        status: ""
    };

    editRecord(alertId) {
        const selectedAlert = this.state.alerts.find((alert) => {
            return (alert.alertId === alertId)
        });
        console.log("Selected alert: " + JSON.stringify(selectedAlert));
        this.setState({
            selectedAlert: selectedAlert,
            newRecord: false,
            modalIsOpen: true,
        });
        // this.openModal();
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    closeModal2() {
        this.setState({
            modalIsOpen: false
        });
    }


    renderShowsTotal = (start, to, total) => {
        return (
            <p style={{color: 'blue'}}>
                From {start} to {to}, totals is {total}
            </p>
        );
    };

    componentDidMount = () => {
        this.getAlerts();
        this.getSensors();
        this.getNodes();
        setInterval(this.getAlerts, 1000 * 60);

    };

    getAlerts() {
        let timezone = encodeURIComponent(moment.tz.guess());
        console.log("Timezone: " + timezone);
        AlertsApi.getAlerts(timezone).then(results => {
            this.setState({
                alerts: results.data,
                loading: false
            });
        });
    }

    getSensors() {
        SensorApi.getAll().then(results => {
            const sensors = [];
            results.data.forEach(sensor => {
                sensors.push({value: sensor.sensorId, label: sensor.dropdownLabel})
            });
            this.setState({
                sensors: sensors
            });

        })
    }

    getNodes() {
        NodeApi.getNodes().then(results => {
            const nodes = [];
            results.data.forEach(node => {
                console.log("Node ID: " + node.nodeId + "   Node name: " + node.nodeName)
                nodes.push({value: node.nodeId, label: node.nodeName})
            });
            this.setState({
                nodes: nodes
            });

        })
            .catch(err => {
                console.log("Error: " + err);
            })
    }


    options = {
        afterInsertRow: this.onAfterInsertRow,   // A hook for after insert rows
        page: 1,  // which page you want to show as default
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }], // you can change the dropdown list for size per page
        sizePerPage: 5,  // which size per page you want to locate as default
        pageStartIndex: 1, // where to start counting the pages
        paginationSize: 3,  // the pagination bar size.
        alwaysShowAllBtns: true,
        withFirstAndLast: true,
        paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
    };

    cellEdit = {
        mode: 'click' // click cell to edit
    };

    static setStatusColor(cell, row, rowIndex, colIndex) {
        let activeCss;
        if (row.active) {
            activeCss = "active-true "
        } else {
            activeCss = "active-false "
        }

        if (row.alertType === "Node") {
            if (row.status === 'a-ok') {
                return activeCss + "status-ok node-alert"
            } else {
                return activeCss + "status-danger node-alert"
            }
        } else if (row.alertType === "Sensor") {
            if (row.status === 'a-ok') {
                return activeCss + "status-ok sensor-alert"
            } else {
                return activeCss + "status-danger sensor-alert"
            }

        } else if (row.alertType === "Watering") {
            if (row.status === 'a-ok') {
                return activeCss + "status-ok watering-alert"
            } else {
                return activeCss + "status-danger watering-alert"
            }

        }
    }

    static checkBoxFormatter(cell, row) {
        if (row.active) {
            return ("︎︎✅");
        } else {
            return ("︎❌");
        }
    }

    static renderColumns() {
        const columns = [{
            dataField: 'alertId',
            text: 'Alert ID',
            sort: true,
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'alertName',
            text: 'Alert Name',
            sort: true,
            hidden: true
        }, {
            dataField: 'target',
            text: 'Target',
            sort: true,
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'criteria',
            text: 'Criteria',
            sort: true,
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'current',
            text: 'Current',
            sort: true,
            classes: AlertsMain3.setStatusColor
        },
            //     {
            //     dataField: 'lowValue',
            //     text: 'Low Value',
            //     style: {
            //         width: '20px'
            //     },
            //     classes: this.setStatusColor
            // }, {
            //     dataField: 'highValue',
            //     text: 'High Value',
            //     classes: this.setStatusColor
            // },
            //     {
            //     dataField: 'currentValue',
            //     text: 'Current Value',
            //     classes: this.setStatusColor
            // },
            {
                dataField: 'status',
                text: 'Status',
                classes: AlertsMain3.setStatusColor
            }, {
                dataField: 'sensorName',
                text: 'Sensor Name',
                hidden: true
            }, {
                dataField: 'active',
                text: 'Active',
                classes: AlertsMain3.setStatusColor,
                formatter: AlertsMain3.checkBoxFormatter
            }
        ];

        return [{
            dataField: 'alertId',
            text: 'Alert ID',
            sort: true,
            hidden: false,
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'alertName',
            text: 'Alert Name',
            sort: true,
            hidden: true
        }, {
            dataField: 'target',
            text: 'Target',
            sort: true,
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'criteria',
            text: 'Criteria',
            sort: true,
            classes: AlertsMain3.setStatusColor
        }, {
            //     {
            dataField: 'current',
            text: 'Current',
            sort: true,
            classes: AlertsMain3.setStatusColor
        },
            //     dataField: 'lowValue',
            //     text: 'Low Value',
            //     style: {
            //         width: '20px'
            //     },
            //     classes: this.setStatusColor
            // }, {
            //     dataField: 'highValue',
            //     text: 'High Value',
            //     classes: this.setStatusColor
            // },
            //     {
            //     dataField: 'currentValue',
            //     text: 'Current Value',
            //     classes: this.setStatusColor
            // },
            {
                dataField: 'status',
                text: 'Status',
                classes: AlertsMain3.setStatusColor
            }, {
                dataField: 'sensorName',
                text: 'Sensor Name',
                hidden: true
            }, {
                dataField: 'active',
                text: 'Active',
                classes: AlertsMain3.setStatusColor,
                formatter: AlertsMain3.checkBoxFormatter
            }
        ];

    }

    defaultSorted = [{
        dataField: 'alertId',
        order: 'asc'
    }];

    newRecord = () => {
        this.setState({
            newRecord: true,
            modalIsOpen: true,
            selectedAlert: this.blankAlert
        });
        // this.openModal();
    };

    newRecord2 = () => {
        this.setState({
            newRecord: true,
            modal2IsOpen: true,
            selectedAlert: this.blankAlert
        });
        // this.openModal();
    };

    required = (value, props) => {
        console.log("In required - value: " + value + " Props: " + props);
        if (!value || (props.isCheckable && !props.checked)) {
            return <span className="form-error is-visible">Required</span>;
        }
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

    isRelative = (value, props, components) => {
        // console.log("Components: " + JSON.stringify(components))
        const bothUsed = components.highValue[0].isUsed && components.lowValue[0].isUsed;
        const bothChanged = components.highValue[0].isChanged && components.lowValue[0].isChanged;

        if (bothChanged && bothUsed && parseInt(components.lowValue[0].value) > parseInt(components.highValue[0].value)) {
            return <span className="form-error is-visible">Low value must be below high value.</span>;
        }
    };

    handleCheckboxClick = (event) => {
        let selectedAlert = this.state.selectedAlert;
        selectedAlert.active = event.target.checked;
        this.setState({
            selectedAlert: selectedAlert
        });

    };

    handleAlertTypeDropdown = (event) => {
        let selectedAlert = this.state.selectedAlert;
        selectedAlert.alertType = event.target.value;
        this.setState({
            selectedAlert: selectedAlert
        })
    }

    handleClick = () => {
        this.form.validateAll();
    };

    static removeUnusedProperties(alert) {
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
            delete alert.nodeId
            alert.sensorId = alert.sensorIdWatering;
            delete alert.sensorIdWatering;
        }

    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            modalIsOpen: false
        });
        if (this.state.newRecord) {
            let newAlert = Object.assign(this.form.getValues());
            newAlert.active = this.state.selectedAlert.active;
            newAlert.status = "a-ok";
            AlertsMain3.removeUnusedProperties(newAlert);
            console.log("New alert: " + JSON.stringify(newAlert));
            AlertsApi.createAlert(newAlert).then(data => {
                this.getAlerts();
            });
        } else {
            let updatedAlert = Object.assign({alertId: this.state.selectedAlert.alertId}, this.form.getValues());
            updatedAlert.active = this.state.selectedAlert.active;
            AlertsMain3.removeUnusedProperties(updatedAlert);
            AlertsApi.updateAlert(updatedAlert).then(data => {
                console.log("Return from update alert: " + data);
                this.getAlerts();
            });
        }
    };

    isInputGroupHidden = (groupType) => {
        if (this.state.selectedAlert.alertType === groupType) {
            return false;
        } else {
            return true;
        }
    };


    selectRow = {
        mode: 'checkbox', // or checkbox
        clickToSelect: true,
    };

    rowEvents = {
        onDoubleClick: (e, row, rowIndex) => {
            // console.log("e: " + JSON.stringify(e));
            console.log("row: " + JSON.stringify(row));
            console.log("rowIndex: " + rowIndex);
            this.editRecord(row.alertId);
        }
    };

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <h1>Your data is loading</h1>
                    <img src={Images.loadingGif} alt='loading'/>
                </div>
            )
        } else
            return (
                <div>
                    <div style={{padding: "5px"}}>
                        <button className="editButton" type="button" onClick={this.newRecord}>New</button>
                    </div>


                    <BootstrapTable
                        ref={n => this.node = n}
                        data={this.state.alerts}
                        striped={true}
                        condensed={true}
                        defaultSorted={this.defaultSorted}
                        bootstrap4={true}
                        classes="table-class"
                        cellEdit={cellEditFactory({mode: 'click', blurToSave: true})}
                        keyField='alertId'
                        selectRow={this.selectRow}
                        rowEvents={this.rowEvents}
                        columns={AlertsMain3.renderColumns()}>

                    </BootstrapTable>
                    {/*<EditAlertModal */}
                    {/*isOpen={this.state.modal2IsOpen} */}
                    {/*selectedAlert={this.state.selectedAlert} */}
                    {/*closeModal={this.closeModal2}*/}
                    {/*/>*/}
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        ariaHideApp={false}
                        onRequestClose={this.closeModal}
                        contentLabel="Example Modal">
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
                                            name="active"
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
                                        <Select name='sensorId' value={this.state.selectedAlert.sensorId}
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
                                        <Select name='nodeId' value={this.state.selectedAlert.nodeId}
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
                                        <Select name='sensorIdWatering' value={this.state.selectedAlert.sensorId}
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
                                    <Button className="btn btn-primary">Submit</Button>
                                </div>
                                <div className="small-3 medium-2 columns">
                                    <button className="btn btn-danger" type="button" onClick={this.closeModal}>Cancel
                                    </button>
                                </div>
                                <div className="small-3 medium-2 columns">
                                    <button className="btn btn-primary" type="button"
                                            onClick={this.handleClick}>Validate all
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </Modal>

                </div>
            );

    };


}

export default AlertsMain3;
