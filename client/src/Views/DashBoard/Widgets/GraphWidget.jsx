import React, {Component} from 'react';
import Graphs from "../index";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import sensorApi from "../../../Data/sensor-api"


class GraphWidget extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.state = {
            dropdownOpen: false,
            dropDownValue: 'Select a graph',
            loading: true,
            list: [],
            sensorId: this.props.sensorId,
            sensorName: 'sensorData',
            units: 'units'
        };
    }

    componentDidMount = () => {
        sensorApi.getAll().then(results => {
            console.log("Sensors: " + JSON.stringify(results.data));
            this.setState({
                list: results.data,
                loading: false
            })
        });
    };

    toggle() {
        console.log("Dropdown state before: " + this.state.dropdownOpen);
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
        console.log("Dropdown state after: " + this.state.dropdownOpen);
    }

    handleSelect(e) {
        console.log("Handle select");
        for(let i=0; i<this.state.list.length; i++) {
            if(this.state.list[i].sensorId === e.currentTarget.textContent) {
                console.log("Found it");
                this.setState({
                    sensorName: this.state.list[i].sensorName,
                    units: this.state.list[i].units
                });
                break;
            }
        }
        this.setState({
            dropDownValue: e.currentTarget.textContent,
            sensorId: e.currentTarget.textContent
        });
    }

    render() {
        return (
            <div>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
                        {this.state.dropDownValue}
                    </DropdownToggle>
                    <DropdownMenu>
                        {!this.state.loading && this.state.list.map((item) =>
                            <DropdownItem key={item.sensorId}  onClick={this.handleSelect}>{item.sensorId}</DropdownItem>
                        )}
                      </DropdownMenu>
                </Dropdown>
                <Graphs.Graphs.ReusableGraph  sensorId={this.state.sensorId} sensorName={this.state.sensorName} units={this.state.units}/>
            </div>
        )
    }

}

export default GraphWidget;