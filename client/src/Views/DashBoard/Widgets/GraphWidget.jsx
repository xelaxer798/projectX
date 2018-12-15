import React, {Component} from 'react';
import Graphs from "../index";
import {Button} from 'reactstrap';
import SensorApi from "../../../Data/sensor-api";
import SensorDataAPI from '../../../Data/sensorData-api';
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select';
import './widget.css';
import moment from 'moment';
import Constants from "../Constants";
import Plot from "react-plotly.js";
import Images from "../../../Images";
import Grid from "@material-ui/core/Grid/Grid";
import SimpleStorage, { clearStorage, resetParentState } from "react-simple-storage";


class GraphWidget extends Component {
    constructor(props) {
        super(props);

        this.toggle1 = this.toggle1.bind(this);
        // this.handleSelect1 = this.handleSelect1.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.getData = this.getData.bind(this);
        this.pushyAxisIfNecessary = this.pushyAxisIfNecessary.bind(this);
        this.getUnitsBySensorId = this.getUnitsBySensorId.bind(this);
        this.getSensorNameBySensorId = this.getSensorNameBySensorId.bind(this);
        GraphWidget.updateGraphInfo = GraphWidget.updateGraphInfo.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnSelectAll = this.handleOnSelectAll.bind(this);

        this.state = {
            dropdownOpen1: false,
            dropDownValue1: 'Select a graph',
            loading: true,
            list1: [],
            sensorId1: this.props.sensorId,
            sensorName1: this.props.sensorName,
            units1: this.props.units,
            sensors: [],
            graphs: [],
            graphData: [],
            selectedGraphs: [],
            yAxis: [],
            layout: {},
            clearPlotLabel: "Clear Plots",
            selected: []
        };
    }

    componentDidMount = () => {

        SensorApi.getAll().then(results => {
            const sensors = [];
            results.data.forEach(sensor => {
                sensors.push({
                    value: sensor.sensorId,
                    label: sensor.dropdownLabel,
                    units: sensor.units
                })
            });
            this.setState({
                sensors: sensors
            });

        })
    };

    toggle1() {
        console.log("Dropdown state before: " + this.state.dropdownOpen1);
        this.setState(prevState => ({
            dropdownOpen1: !prevState.dropdownOpen1
        }));
        console.log("Dropdown state after: " + this.state.dropdownOpen1);
    }

    handleClose() {
        console.log("clicked close");
    }

    // handleSelect1(e) {
    //     console.log("Handle select");
    //     for (let i = 0; i < this.state.list1.length; i++) {
    //         if (this.state.list1[i].dropdownLabel === e.currentTarget.textContent) {
    //             console.log("Found it");
    //             this.setState({
    //                 sensorName1: this.state.list1[i].dropdownLabel,
    //                 units1: this.state.list1[i].units,
    //                 sensorId1: this.state.list1[i].sensorId
    //             });
    //             break;
    //         }
    //     }
    //     this.setState({
    //         dropDownValue1: e.currentTarget.textContent,
    //
    //     });
    // }

    getRowStyle(row, rowIndex) {
        // console.log("Row: " + JSON.stringify(row));
        // console.log("Row Index: " + rowIndex);
        return {
            color: row.graphColor.color,
            fontSize: 'small'
        };
    }

    renderColumns() {
        return [{
            dataField: 'sensorId',
            text: 'Sensor ID',
            hidden: true
        }, {
            dataField: 'sensorName',
            text: 'Sensor Name',
            sort: true,
        }, {
            dataField: 'currentValue',
            text: 'Current Value',
            sort: true
        }, {
            dataField: 'lastReported',
            text: 'Last Reported',
            sort: true
        }
        ];

    }

    getSensors() {
        SensorApi.getAll().then(results => {
            const sensors = [];
            results.data.forEach(sensor => {
                console.log("Sensor: " + JSON.stringify(sensor));
                sensors.push({
                    value: sensor.sensorId,
                    label: sensor.dropdownLabel,
                    units: sensor.units
                })
            });
            this.setState({
                sensors: sensors
            });

        })
    }

    handleSelectChange(optionSelected) {
        console.log("Name: " + this.name);
        console.log("Value: " + optionSelected.value);
        console.log("Label: " + optionSelected.label);
        let selectedGraphs = this.state.selectedGraphs;
        selectedGraphs.push({
            sensorId: optionSelected.value,
            sensorName: optionSelected.label,
            currentValue: 0,
            lastReported: 0
        });
        // this.setState({graphs: graphs});
        console.log("Graphs1: " + JSON.stringify(this.state.selectedGraphs));
        this.setState({
            loading: true
        });
        this.getData();
        console.log("Graphs3: " + JSON.stringify(this.state.selectedGraphs));
    }

    customStyles = {
        input: styles => {
            return {
                ...styles,
                height: '1'
            };
        }
    };

    pushyAxisIfNecessary(units, arrayOfAxis) {
        const numberOfAxis = arrayOfAxis.length;
        for (var i = 0; i < numberOfAxis; i++) {
            if (arrayOfAxis[i].units === units) {
                return (arrayOfAxis[i].yAxisNameData);
            }
        }
        //we have a new one
        let yAxisNameData, yAxisNameLayout = "";
        if (numberOfAxis === 0) {
            yAxisNameData = "";
            yAxisNameLayout = "yaxis"
        } else {
            let nextNumber = numberOfAxis + 1;
            yAxisNameData = "y" + nextNumber;
            yAxisNameLayout = "yaxis" + nextNumber;
        }
        arrayOfAxis.push({
            units: units,
            yAxisNameData: yAxisNameData,
            yAxisNameLayout: yAxisNameLayout
        });
        this.setState({
            yAxis: arrayOfAxis
        });

        console.log("Axis from state: " + JSON.stringify(this.state.yAxis));
        console.log("return yaxis data nameqq: " + JSON.stringify(yAxisNameData));

        return yAxisNameData;
    }

    getUnitsBySensorId(sensorId) {
        console.log("Sensorszzzz: " + JSON.stringify(this.state.sensors));
        for (let i = 0; i < this.state.sensors.length; i++) {
            console.log("Sensor Id: " + this.state.sensors[i].value + " Units: " + this.state.sensors[i].units);
            if (this.state.sensors[i].value === sensorId) {
                console.log("Sensor Id: " + sensorId + " Units: " + this.state.sensors[i].units);
                return this.state.sensors[i].units;
            }
        }
        //didn't find anything
        return "";
    }

    getSensorNameBySensorId(sensorId) {
        console.log("Sensorsxxxx: " + JSON.stringify(this.state.sensors));
        for (let i = 0; i < this.state.sensors.length; i++) {
            console.log("Sensor Id: " + this.state.sensors[i].value + " Sensor Name: " + this.state.sensors[i].label);
            if (this.state.sensors[i].value === sensorId) {
                console.log("Sensor Id: " + sensorId + " Sensor Name: " + this.state.sensors[i].label);
                return this.state.sensors[i].label;
            }
        }
        //didn't find anything
        return "";
    }

    static updateGraphInfo(graphList, sensorId, currentValue, lastReporting) {
        for (let i = 0; i < graphList.length; i++) {
            if (graphList[i].sensorId === sensorId) {
                console.log("Graphs4.1: " + JSON.stringify(this.state.graphs));
                graphList[i].currentValue = currentValue;
                graphList[i].lastReported = lastReporting;
                graphList[i].sensorName = graphList[i].sensorName + "z";
                console.log("Graphs4.2: " + JSON.stringify(this.state.graphs));
            }
        }
    }

    generateLayout = () => {
        let domain = [];
        const numberOfyAxis = this.state.yAxis.length;
        if (numberOfyAxis <= 2) {
            domain = [0, 1]
        } else {
            domain = [0.1, 0.9]
        }
        let layout = {
            autosize: true,
            margin: {
                // l: 50,
                // r: 50,
                // b: 100,
                // t: 100,
                pad: 1
            },
            showlegend: false,
            xaxis: {
                tickfont: {
                    family: 'Old Standard TT, serif',
                    size: 12,
                    color: 'black'
                },
                ticks: 'outside',
                // rangeselector: Constants.selectorOptions,
                // rangeslider: {},
                tickangle: -45,
                tickformat: '%a %I:%M%p %e-%b',
                tickcolor: '#000',
                autotick: true,
                domain: domain
            },
        };
        console.log("yAxis from state: " + JSON.stringify(this.state.yAxis));
        this.state.yAxis.forEach((yAxis, index, array) => {
            let side = "";
            let position = 0;
            let anchor = "";
            if (index % 2 === 0) {
                side = "left";
                anchor = 'free';
                if (index > 0) {
                    position = 0
                }
            } else {
                side = "right";
                if (index > 1) {
                    position = 1 - ((index - 1) * .05);
                }
                anchor = 'x'
            }
            if (index === 0) {
                layout[yAxis.yAxisNameLayout] = {
                    title: yAxis.units
                }

            } else {
                layout[yAxis.yAxisNameLayout] = {
                    title: yAxis.units,
                    side: side,
                    overlay: 'y',
                    rangemode: 'tozero',
                    overlaying: 'y',
                    anchor: anchor,
                    position: position
                }

            }
            console.log("Building y axis: " + JSON.stringify(yAxis));
            console.log("index: " + index);
            console.log("array: " + JSON.stringify(array));

        });
        console.log("Layoutqq: " + JSON.stringify(layout));
        this.setState({
            layout: layout
        });
        return layout;
    };

    onSliderChange = (figure) => {
        console.log("Figure: " + JSON.stringify(figure.data[0].x.length));
        // console.log("Graph DIV: " + JSON.stringify(graphDiv));
    }


    getData() {

        let plotColors = [
            {color: 'purple'},
            {color: 'deepskyblue'},
            {color: 'green'},
            {color: 'red'},
            {color: 'chocolate'},
            {color: 'darkslategray'},
            {color: 'magenta'}
        ];
        let yaxises = [];
        let returnData = [];
        // let temp = [];
        let promises = this.state.selectedGraphs.map(function (selectedGraphs) {
            console.log("Create promise: " + selectedGraphs.sensorId);
            return SensorDataAPI.getAll(selectedGraphs.sensorId);
        });
        let self = this;
        let graphList = [];
        Promise.all(promises).then(function (data) {
            console.log("in promise: " + JSON.stringify(data));

            if (data.data !== null || data.data !== undefined || data.data !== []) {
                data.map(function (individualData, index) {
                    console.log("Individual data: " + JSON.stringify(individualData.data.sensorData));
                    let yAxis = self.pushyAxisIfNecessary(self.getUnitsBySensorId(individualData.data.sensorId), yaxises);
                    console.log("looking for a hit axisqq: " + JSON.stringify(yAxis));
                    if (yAxis !== "") {
                        console.log("we have a hit axisqq: " + JSON.stringify(yAxis));
                        individualData.data.sensorData[0].yaxis = yAxis;
                    }
                    individualData.data.sensorData[0].marker = plotColors[index];
                    individualData.data.sensorData[0].name = self.getSensorNameBySensorId(individualData.data.sensorId);
                    returnData.push(individualData.data.sensorData[0]);
                    const formattedDateTime = moment(individualData.data.sensorData[0].x[0]).format('MMM. D, YYYY [at] h:mm A z');
                    graphList.push({
                        sensorId: individualData.data.sensorId,
                        sensorName: self.getSensorNameBySensorId(individualData.data.sensorId),
                        currentValue: individualData.data.sensorData[0].y[0],
                        lastReported: formattedDateTime,
                        graphColor: plotColors[index]
                    });
                })

            }

        }).then(() => {
            this.generateLayout();
            console.log("Y axis: " + JSON.stringify(yaxises));
            console.log("Graphs2.1: " + JSON.stringify(this.state.graphs));
            this.setState({
                graphData: returnData,
                graphs: graphList,
                loading: false
            });
            console.log("Graphs2.2: " + JSON.stringify(this.state.graphs));
            console.log("Data 2.2: " + JSON.stringify(this.state.graphData));

        })
    }

    handleOnSelect = (row, isSelect) => {
        console.log("Selected rows before: " + this.state.selected);
        if (isSelect) {
            this.setState(() => ({
                selected: [...this.state.selected, row.sensorId]
            }));
        } else {
            this.setState(() => ({
                selected: this.state.selected.filter(x => x !== row.sensorId)
            }));
        }
        console.log("Selected rows after: " + this.state.selected);
    };

    handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r.sensorId);
        if (isSelect) {
            this.setState(() => ({
                selected: ids
            }));
        } else {
            this.setState(() => ({
                selected: []
            }));
        }
        console.log("Selected rows: " + this.state.selected);
    };



    render() {
        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            selected: this.state.selected,
            onSelect: this.handleOnSelect,
            onSelectAll: this.handleOnSelectAll
        };

        return (
            <div>
                {/*<SimpleStorage parent={this} prefix={this.props.uniqueId} blackList={['selected']}/>*/}
                <Grid container spacing={40}>
                    <Grid item xs={6} lg={8}>
                        <Select
                            options={this.state.sensors}
                            styles={this.customStyles}
                            onChange={this.handleSelectChange}/>
                    </Grid>
                    <Grid item xs={2} lg={2}>
                        <Button onClick={this.clearSensors}>{this.state.clearPlotLabel}</Button>
                    </Grid>
                    <Grid  item xs={2} lg={2}>
                        <button onClick={() => clearStorage(this.props.uniqueId)}>
                            clearStorage
                        </button>
                    </Grid>
                </Grid>


                <BootstrapTable
                    ref={n => this.node = n}
                    data={this.state.graphs}
                    striped={true}
                    condensed={true}
                    bootstrap4={true}
                    classes="table-class"
                    keyField='sensorId'
                    rowStyle={this.getRowStyle}
                    columns={this.renderColumns()}
                    selectRow={selectRow}
                >

                </BootstrapTable>
                <div>
                    <div style={{paddingLeft: '10px', color: 'black'}}>
                        {!this.state.loading ? <Plot

                            data={this.state.graphData}
                            onSelected={this.onSliderChange}
                            layout={this.state.layout}
                            useResizeHandler={true}
                            style={{width: "100%", height: "100%"}}
                        /> : <div>
                            <h1>Your Graphs are Loading</h1>
                            <img src={Images.loadingGif} alt='loading'/>
                        </div>}

                    </div>
                </div>

                {/*<Graphs.Graphs.ReusableGraph sensorId={this.state.sensorId1}*/}
                {/*sensorName={this.state.sensorName1}*/}
                {/*graphData={this.state.graphData}*/}
                {/*units={this.state.units1}/>*/}
            </div>
        )
    }

}

export default GraphWidget;