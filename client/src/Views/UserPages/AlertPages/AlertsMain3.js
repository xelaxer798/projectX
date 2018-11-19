import React, {Component} from 'react';
import AlertsApi from '../../../Data/alerts-api'
import SensorApi from '../../../Data/sensor-api'
import Images from "../../../Images";
import BootstrapTable from 'react-bootstrap-table-next';
import './AlertsMain.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor';
import Modal from 'react-modal';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button'
import {isEmail} from 'validator';
import './foundation-flex.css';

class AlertsMain3 extends Component {

    constructor(props) {
        super(props);
        let height = 400;

        this.state = {
            isLoading: false,
            alerts: [],
            modalIsOpen: false,
            tableHeight: height + "px",
            selectedAlert: this.blankAlert,
            sensors: []
        };
        this.newRecord = this.newRecord.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isRelative = this.isRelative.bind(this);
        this.editRecord = this.editRecord.bind(this);
        this.renderColumns = this.renderColumns.bind(this);
        this.editRecord = this.editRecord.bind(this);
        this.setStatusColor = this.setStatusColor.bind(this);
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
    };

    getAlerts() {
        AlertsApi.getAlerts().then(results => {
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

    setStatusColor(cell, row, rowIndex, colIndex) {
        if (row.status === 'a-ok') {
            return "status-ok"
        } else {
            return "status-danger"
        }
    }

    renderColumns() {
        const columns = [{
            dataField: 'alertId',
            text: 'Alert ID',
            sort: true,
            hidden: true
        }, {
            dataField: 'alertName',
            text: 'Alert Name',
            sort: true
        }, {
            dataField: 'lowValue',
            text: 'Low Value'
        }, {
            dataField: 'highValue',
            text: 'High Value'
        }, {
            dataField: 'status',
            text: 'Status',
            classes: this.setStatusColor
        }, {
            dataField: 'sensorName',
            text: 'Sensor Name',
        }, {
            dataField: 'active',
            text: 'Active',

            editor: {
                type: Type.CHECKBOX,
                value: 'Y:N'
            }
        }
        ];

        return columns;

    }

    defaultSorted = [{
        dataField: 'alertId',
        order: 'asc'
    }];

    newRecord = () => {
        this.setState({
            newRecord: true,
            modalIsOpen: true,
        });
        // this.openModal();
    };

    required = (value, props) => {
        if (!value || (props.isCheckable && !props.checked)) {
            return <span className="form-error is-visible">Required</span>;
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

    handleClick = () => {
        this.form.validateAll();
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            modalIsOpen: false
        });
        if (this.state.newRecord) {
            let newAlert = Object.assign(this.form.getValues());
            newAlert.status = "a-ok";
            AlertsApi.createAlert(newAlert).then(data => {
                this.getAlerts();
            });
        } else {
            let updatedAlert = Object.assign({alertId: this.state.selectedAlert.alertId}, this.form.getValues());
            updatedAlert.active = this.state.selectedAlert.active;
            AlertsApi.updateAlert(updatedAlert).then(data => {
                console.log("Return from update alert: " + data);
                this.getAlerts();
            });
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
                    <button className="btn btn-default" onClick={this.newRecord}>New</button>

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
                        columns={this.renderColumns()}>

                    </BootstrapTable>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        ariaHideApp={false}
                        onRequestClose={this.closeModal}
                        contentLabel="Example Modal">
                        <Form ref={c => {
                            this.form = c
                        }} onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="small-12 columns">
                                    <h3>New Alert</h3>
                                    <button className="button" type="button" onClick={this.handleClick}>Validate all
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="small-12 medium-4 columns">
                                    <label>
                                        Alert Name*
                                        <Input
                                            placeholder="Alert Name"
                                            type="text"
                                            name="alertName"
                                            value={this.state.selectedAlert.alertName}
                                            validations={[this.required]}
                                        />
                                    </label>
                                </div>
                                <div className="small-12 medium-4 columns">
                                    <label>
                                        High Value*
                                        <Input
                                            type="number"
                                            name="highValue"
                                            value={this.state.selectedAlert.highValue}
                                            validations={[this.required, this.isRelative]}
                                        />
                                    </label>
                                </div>
                                <div className="small-12 medium-4 columns">
                                    <label>
                                        Low Value*
                                        <Input
                                            type="number"
                                            name="lowValue"
                                            value={this.state.selectedAlert.lowValue}
                                            validations={[this.required, this.isRelative]}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="small-12 medium-6 columns">
                                    <label>
                                        Sensor
                                        <Select name='sensorId' value={this.state.selectedAlert.sensorId}
                                                validations={[this.required]}>
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
                                <div className="small-12 medium-6 columns">
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
                                <div className="small-12 medium-6 columns">
                                    <label>
                                        Active
                                        <Input
                                            type="checkbox"
                                            name="active"
                                            // value="true"
                                            checked={this.state.selectedAlert.active}
                                            ref={active => this.active = active}
                                            onChange={this.handleCheckboxClick}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="small-12 medium-6 columns">
                                    <Button className="button">Submit</Button>
                                </div>
                            </div>
                        </Form>
                    </Modal>

                </div>
            );

    };


}

export default AlertsMain3;
