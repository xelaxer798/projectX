import React, {Component} from 'react';
import Modal from 'react-modal';
import Form from "react-validation/build/form";
import Select from "react-validation/build/select";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";

class EditAlertModal extends Component {

    constructor(props) {
        super(props);

    }

        isInputGroupHidden = (groupType) => {
        if (this.props.selectedAlert.alertType === groupType) {
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


    render() {
        return (
            <div>
                 <Modal
                    isOpen={this.props.isOpen}
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
                                        value={this.props.selectedAlert.alertType}
                                        onChange={this.handleAlertTypeDropdown}
                                        validations={[this.required]}>
                                    <option value=''>Alert Type</option>
                                    <option key="Sensor" value="Sensor">Sensor</option>
                                    <option key="Node" value="Node">Node</option>
                                </Select>
                            </div>
                            <div className="small-12 medium-4 columns">
                                <label>
                                    Alert Name*
                                    <Input
                                        placeholder="Alert Name"
                                        type="text"
                                        name="alertName"
                                        value={this.props.selectedAlert.alertName}
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
                                        value={this.props.selectedAlert.status}
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
                                        checked={this.props.selectedAlert.active}
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
                                    <Select name='sensorId' value={this.props.selectedAlert.sensorId}
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
                                        value={this.props.selectedAlert.highValue}
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
                                        value={this.props.selectedAlert.lowValue}
                                        validations={[this.requiredSensorAlert, this.isRelative]}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="row" hidden={this.isInputGroupHidden("Node")}>
                            <div className="small-12 medium-4 columns">
                                <label>
                                    Node
                                    <Select name='nodeId' value={this.props.selectedAlert.nodeId}
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
                                        value={this.props.selectedAlert.nodeNonReportingTimeLimit}
                                        validations={[this.requiredNodeAlert]}
                                    />
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