import React, {Component} from 'react';
import Graphs from "../index";
import {Button} from 'react-bootstrap';
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
import SimpleStorage, {clearStorage, resetParentState} from "react-simple-storage";

// import WrapWithLocalStorage from '../../../HOCs/WrapWithLocalStorage'


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
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
        this.removePlots = this.removePlots.bind(this);
        this.concatSensorData = this.concatSensorData.bind(this);
        this.getVisibleBySensorId = this.getVisibleBySensorId.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.getPlotColor = this.getPlotColor.bind(this);
        // this.hydrateStateWithLocalStorage = this.hydrateStateWithLocalStorage.bind(this);
        // this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this);

        this.state = {
            dropdownOpen1: false,
            dropDownValue1: 'Select a graph',
            loading: true,
            list1: [],
            sensorId1: this.props.sensorId,
            sensorName1: this.props.sensorName,
            units1: this.props.units,
            sensors: [],
            graphDataToPlot: [],
            selectedGraphs: [],
            timespans: [
                {
                    value: 1,
                    label: 'Past hour'
                },
                {
                    value: 6,
                    label: 'Past 6 hours'
                },
                {
                    value: 12,
                    label: 'Past 12 hours'
                },
                {
                    value: 24,
                    label: 'Past 24 hours'
                },
                {
                    value: 48,
                    label: 'Past 48 hours'
                },
                {
                    value: 72,
                    label: 'Past 72 hours'
                },
                {
                    value: 24 * 7,
                    label: 'Past week'
                },
                {
                    value: 24 * 7 * 2,
                    label: 'Past 2 weeks'
                },
                {
                    value: 24 * 7 * 4,
                    label: 'Past 4 weeks'
                }
            ],
            yAxis: [],
            layout: {},
            hideTableLabel: "Hide table",
            tableHidden: false,

            removePlotLabel: {
                label: "Remove Plot(s)",
                disabled: true
            },
            selected: [],
            selectedTimePeriod: {
                value: 24,
                label: 'Past Day'
            },
            currentSort: []
        };
        document.title = "Project X - Dashboard"
    }

    componentDidMount = () => {
        console.log("Bringing state back");
        // this.hydrateStateWithLocalStorage();

        // add event listener to save state to localStorage
        // when user leaves/refreshes the page
        // window.addEventListener(
        //     "beforeunload",
        //     this.saveStateToLocalStorage.bind(this)
        // );

        // parse the localStorage string and setState
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
            }, this.bringBackFromLocalStorage);

        });


        setInterval(this.getData, 1000 * 60);
    };

    bringBackFromLocalStorage = () => {
        let selectedGraphs = [];
        let selectedTimePeriod = {
            value: 24,
            label: 'Past Day'
        };
        let sortOrder = [];
        if (localStorage.hasOwnProperty(this.props.uniqueId + "selectedGraphs")) {
            selectedGraphs = localStorage.getItem(this.props.uniqueId + "selectedGraphs");
        }
        if (localStorage.hasOwnProperty(this.props.uniqueId + "selectedTimePeriod")) {
            selectedTimePeriod = localStorage.getItem(this.props.uniqueId + "selectedTimePeriod");
            console.log("Getting time select from local storage: " + selectedTimePeriod)
        }
        if (localStorage.hasOwnProperty(this.props.uniqueId + "sortOrder")) {
            sortOrder = localStorage.getItem(this.props.uniqueId + "sortOrder");
            console.log("Getting sort order from local storage: " + sortOrder)
        }

        try {
            selectedGraphs = JSON.parse(selectedGraphs);
            selectedTimePeriod = JSON.parse(selectedTimePeriod);
            sortOrder = JSON.parse(sortOrder);
            this.setState({
                selectedGraphs: selectedGraphs,
                selectedTimePeriod: selectedTimePeriod,
                currentSort: sortOrder
            }, this.getData);
        } catch (e) {
            // handle empty string
            this.setState({
                selectedGraphs: selectedGraphs,
                selectedTimePeriod: selectedTimePeriod,
                currentSort: sortOrder
            }, this.getData);
        }

    }

    // componentWillUnmount() {
    //     window.removeEventListener(
    //         "beforeunload",
    //         this.saveStateToLocalStorage.bind(this)
    //     );
    //     console.log("Component will unmount");
    //     // saves if component has a chance to unmount
    //     this.saveStateToLocalStorage();
    // }
    //
    // hydrateStateWithLocalStorage() {
    //     // for all items in state
    //     for (let key in this.state) {
    //         // if the key exists in localStorage
    //         console.log("Looking for key: " + key);
    //         if (localStorage.hasOwnProperty(key)) {
    //             // get the key's value from localStorage
    //             let value = localStorage.getItem(key);
    //             console.log("Found key: " + key + " value: " + value);
    //
    //             // parse the localStorage string and setState
    //             try {
    //                 value = JSON.parse(value);
    //                 this.setState({[key]: value});
    //             } catch (e) {
    //                 // handle empty string
    //                 this.setState({[key]: value});
    //             }
    //         }
    //     }
    // }

    // saveStateToLocalStorage() {
    //     // for every item in React state
    //     console.log("saving state: " + JSON.stringify(this.state));
    //     debugger;
    //         console.log("saving to local storage: " + "selectedGraphs" + " value: " + JSON.stringify(this.state.selectedGraphs))
    //         localStorage.setItem(this.props.uniqueId + "selectedGraphs", JSON.stringify(this.state.selectedGraphs));
    //
    //     // debugger;
    //     // for (let key in this.state) {
    //     //     // save to localStorage
    //     //     console.log("saving to local storage: " + key + " value: " + JSON.stringify(this.state[key]))
    //     //     localStorage.setItem(key, JSON.stringify(this.state[key]));
    //     // }
    // }

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
            fontSize: 'xs',
            padding: 30
        };
    }

    onSortHandler = (field, order) => {
        console.log("Sort Field: " + field + " order: " + order);
        const newOrder =  [{
            dataField: "currentValue",
            order: "desc"
        }];
        this.setState({currentSort: newOrder})
        localStorage.setItem(this.props.uniqueId + "sortOrder", JSON.stringify(newOrder));

    };

    renderColumns() {
        return [{
            dataField: 'sensorId',
            text: 'Sensor ID',
            hidden: true
        }, {
            dataField: 'sensorName',
            text: 'Sensor Name',
            sort: true,
            onSort: this.onSortHandler
        }, {
            dataField: 'currentValue',
            text: 'Current Value',
            sort: true,
            onSort: this.onSortHandler
        }, {
            dataField: 'lastReported',
            text: 'Last Reported',
            sort: true,
            onSort: this.onSortHandler
        }, {
            dataField: 'visible',
            text: 'Visible'
        }, {
            dataField: 'sensorData',
            hidden: true

        }, {
            dataField: 'graphColor',
            hidden: true
        }, {
            dataField: 'toggleVisible',
            isDummyField: true,
            hidden: false,
            text: '',
            formatter: this.togleVisibility
        }
        ];

    }

    togleVisibility = (cell, row, rowIndex, formatExtraData) => {
        let buttonLabel = "";
        if (row.visible) {
            buttonLabel = 'Hide'
        } else {
            buttonLabel = 'Show'
        }
        return (
            <button className="showHideButton" onClick={() => {
                row.visible = !row.visible;
                this.setState({
                    graphDataToPlot: this.concatSensorData(this.state.selectedGraphs)
                })
            }}>
                {buttonLabel}
            </button>);
    };

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
            lastReported: 0,
            visible: true,
            sensorData: [],
            graphColor: {}
        });
        console.log("Graphs1: " + JSON.stringify(this.state.selectedGraphs));
        this.setState({
            selectedGraphs: selectedGraphs,
            // removePlotLabel: this.configRemovePlotBotton(selectedGraphs.length),
            loading: true
        });
        localStorage.setItem(this.props.uniqueId + "selectedGraphs", JSON.stringify(selectedGraphs));
        this.getData();
        console.log("Graphs3: " + JSON.stringify(this.state.selectedGraphs));
    }

    customStyles = {
        input: (provided, state) => ({
            ...provided,
            height: '20px',
        }),
        option: (provided, state) => ({
            ...provided,
            borderBottom: '1px dotted pink',
            color: state.isSelected ? 'red' : 'blue',
            fontSize: 'small'
        }),
        // control: () => ({
        //     // none of react-select's styles are passed to <Control />
        //     width: 400,
        // }),
        singleValue: (provided, state) => ({
            ...provided,
            borderBottom: '1px dotted pink',
            color: state.isSelected ? 'red' : 'blue',
            fontSize: 'small'
        })

    };

    configRemovePlotBotton = (numberOfGraphs) => {

        let disabled = true;
        let label = "";
        if (numberOfGraphs === 0) {
            disabled = true;
            label = "Remove Plot(s)"
        } else if (numberOfGraphs === 1) {
            disabled = false;
            label = "Remove Plot"
        } else {
            disabled = false;
            label = "Remove Plots"
        }

        return {
            label: label,
            disabled: disabled
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
        console.log("couldn't find name for: " + sensorId);
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
        if (numberOfyAxis === 1) {
            domain = [0, 1]
        } else if (numberOfyAxis === 2) {
            domain = [0, 0.95]
        } else if (numberOfyAxis === 3) {
            domain = [0.1, 0.95]
        } else {
            domain = [0.1, 0.8]
        }
        let layout = {
            autosize: true,
            margin: {
                l: 50,
                r: 50,
                b: 100,
                t: 20,
                pad: 1
            },
            showlegend: false,
            modebar: {
                orientation: 'v'
            },

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
                // tickformat: '%a %I:%M%p %e-%b',
                tickformat: '%m/%e/%y %I:%M %p',
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
                if (index === 1) {
                    position = 0;
                    anchor = 'x'
                } else if (index === 3) {
                    position = .9;
                    anchor = 'free'
                }
            }
            if (index === 0) {
                layout[yAxis.yAxisNameLayout] = {
                    title: yAxis.units,

                }

            } else {
                layout[yAxis.yAxisNameLayout] = {
                    title: yAxis.units,
                    side: side,
                    overlay: 'y',
                    rangemode: 'tozero',
                    overlaying: 'y',
                    anchor: anchor,
                    position: position,

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

    handleTimeChange(optionSelected) {
        this.setState({
                selectedTimePeriod: optionSelected
            },
            this.getData
        );
        localStorage.setItem(this.props.uniqueId + "selectedTimePeriod", JSON.stringify(optionSelected));

    }


    plotColors = [
        {color: 'purple'},
        {color: 'deepskyblue'},
        {color: 'green'},
        {color: 'red'},
        {color: 'chocolate'},
        {color: 'darkslategray'},
        {color: 'magenta'},
        {color: 'RoyalBlue'},
        {color: 'hotpink'},
        {color: 'sienna'},
        {color: 'lime'}
    ];

    getPlotColor = (index) => {
        const numberOfColors = this.plotColors.length;
        const indexToUse = index % numberOfColors;
        return this.plotColors[indexToUse];
    };

    getData() {

        let yaxises = [];
        // let returnData = [];
        // let temp = [];
        let self = this;
        let promises = this.state.selectedGraphs.map(function (selectedGraphs) {
            console.log("Create promise: " + selectedGraphs.sensorId);
            return SensorDataAPI.getAll(selectedGraphs.sensorId, self.state.selectedTimePeriod.value);
        });
        let _selectedGraphs = [];
        Promise.all(promises).then(function (data) {
            console.log("in promise: " + JSON.stringify(data));

            if (data.data !== null || data.data !== undefined || data.data !== []) {
                data.map(function (individualData, index) {
                    console.log("Individual data: " + JSON.stringify(individualData.data.sensorData));
                    console.log("Individual data.visible: " + JSON.stringify(individualData));
                    let yAxis = self.pushyAxisIfNecessary(self.getUnitsBySensorId(individualData.data.sensorId), yaxises);
                    console.log("looking for a hit axisqq: " + JSON.stringify(yAxis));
                    if (yAxis !== "") {
                        console.log("we have a hit axisqq: " + JSON.stringify(yAxis));
                        individualData.data.sensorData[0].yaxis = yAxis;
                    }
                    individualData.data.sensorData[0].marker = self.getPlotColor(index);
                    individualData.data.sensorData[0].name = self.getSensorNameBySensorId(individualData.data.sensorId);
                    console.log("Individual data.visible: " + JSON.stringify(individualData));
                    const formattedDateTime = moment(individualData.data.sensorData[0].x[0]).format('M/D/YY h:mm A z');
                    _selectedGraphs.push({
                        sensorId: individualData.data.sensorId,
                        sensorName: self.getSensorNameBySensorId(individualData.data.sensorId),
                        sensorData: individualData.data.sensorData[0],
                        currentValue: individualData.data.sensorData[0].y[0],
                        lastReported: formattedDateTime,
                        graphColor: self.getPlotColor(index),
                        visible: self.getVisibleBySensorId(individualData.data.sensorId)
                    });
                })

            }

        }).then(() => {
            this.generateLayout();
            console.log("Y axis: " + JSON.stringify(yaxises));
            console.log("Graphs2.1: " + JSON.stringify(this.state.graphs));
            this.setState({
                graphDataToPlot: this.concatSensorData(_selectedGraphs),
                selectedGraphs: _selectedGraphs,
                loading: false
            });
            console.log("Graphs2.2: " + JSON.stringify(this.state.graphs));
            console.log("Data 2.2: " + JSON.stringify(this.state.graphDataToPlot));

        })
    }

    getVisibleBySensorId = (sensorId) => {
        for (let i = 0; i < this.state.selectedGraphs.length; i++) {
            if (this.state.selectedGraphs[i].sensorId === sensorId) {
                return this.state.selectedGraphs[i].visible;
            }
        }
        //if we got here there are no hits
        return null;
    };

    concatSensorData = (selectedGraphs) => {
        // console.log("Entering concat data: " + JSON.stringify(selectedGraphs));
        let returnData = [];
        selectedGraphs.forEach(graph => {
            if (graph.visible) {
                returnData.push(graph.sensorData)
            }

        });
        // console.log("Return concat data: " + JSON.stringify(returnData));
        return returnData;
    };


    handleOnSelect = (row, isSelect) => {
        console.log("Selected rows before: " + this.state.selected);
        console.log("Boxes selected: " + this.node.selectionContext.state.selected)
        if (isSelect) {
            console.log("We are in in select: " + this.node.selectionContext.state.selected.length)
            this.setState(() => ({
                selected: [...this.state.selected, row.sensorId],
                removePlotLabel: this.configRemovePlotBotton(this.node.selectionContext.state.selected.length + 1)
            }));
        } else {
            console.log("We are not in select: " + this.node.selectionContext.state.selected.length)
            this.setState(() => ({
                selected: this.state.selected.filter(x => x !== row.sensorId),
                removePlotLabel: this.configRemovePlotBotton(this.node.selectionContext.state.selected.length - 1)
            }));
        }
        console.log("Boxes selected: " + this.node.selectionContext.state.selected)
        console.log("Selected rows after: " + this.state.selected);
    };

    handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r.sensorId);
        if (isSelect) {
            this.setState(() => ({
                selected: ids,
                removePlotLabel: this.configRemovePlotBotton(ids.length)
            }));
        } else {
            this.setState(() => ({
                selected: [],
                removePlotLabel: this.configRemovePlotBotton(0)
            }));
        }
        console.log("Selected rows: " + this.state.selected);
    };

    removePlots = (event) => {
        console.log("Remove plot event: " + JSON.stringify(event.target.value));
        console.log("Selected rows for remove: " + JSON.stringify(this.state.selected));
        console.log("Selected graphs before removal: " + this.state.selectedGraphs.length);
        let _selectedGraphs = this.state.selectedGraphs.filter(graph => {
            return this.state.selected.indexOf(graph.sensorId) === -1
        });
        console.log("Selected graphs after removal: " + _selectedGraphs.length);
        this.setState({
            selected: [],
            selectedGraphs: _selectedGraphs,
            removePlotLabel: this.configRemovePlotBotton(_selectedGraphs.length),
            graphDataToPlot: this.concatSensorData(_selectedGraphs)
        });
        localStorage.setItem(this.props.uniqueId + "selectedGraphs", JSON.stringify(_selectedGraphs));

    };

    toggleTableVisibility = (event) => {
        if (this.state.tableHidden) {
            this.setState({
                tableHidden: false,
                hideTableLabel: "Hide table"
            })
        } else {
            this.setState({
                tableHidden: true,
                hideTableLabel: "Show table"
            })
        }
    }

    handleUpdate = (figure) => {
        console.log("Figure: " + figure);
        this.setState(figure)

    };

    updateHandler = () => {
        console.log("Updatedzzzz");
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
                    <Grid item xs={6} lg={6}>
                        <Select
                            options={this.state.sensors}
                            styles={this.customStyles}
                            onChange={this.handleSelectChange}/>
                    </Grid>
                    <Grid item xs={6} lg={6}>
                        <Button
                            onClick={this.removePlots}
                            className="btn btn-primary"
                            disabled={this.state.removePlotLabel.disabled}>{this.state.removePlotLabel.label}</Button>
                        <Button
                            onClick={this.toggleTableVisibility}
                            className="btn btn-secondary">{this.state.hideTableLabel}</Button>
                    </Grid>
                </Grid>

                <div hidden={this.state.tableHidden}>

                    <BootstrapTable
                        ref={n => this.node = n}
                        data={this.state.selectedGraphs}
                        striped={true}
                        condensed={true}
                        bootstrap4={true}
                        classes="table-class"
                        keyField='sensorId'
                        rowStyle={this.getRowStyle}
                        columns={this.renderColumns()}
                        selectRow={selectRow}
                        defaultSorted={this.state.currentSort}

                    >

                    </BootstrapTable>
                </div>
                <div>
                    <Select
                        value={this.state.selectedTimePeriod}
                        options={this.state.timespans}
                        onChange={this.handleTimeChange}
                        styles={this.customStyles}
                    />
                </div>
                <div>
                    <div>
                        {!this.state.loading ? <Plot

                            data={this.state.graphDataToPlot}
                            onSelected={this.onSliderChange}
                            layout={this.state.layout}
                            config={{
                                displayModeBar: true,
                                // responsive: true,
                                scrollZoom: true,
                                displaylogo: false,
                            }}
                            useResizeHandler={true}
                            onInitialized={(figure) => {
                                console.log("Initialized: " + figure)
                                this.setState(figure)
                            }}
                            onUpdate={this.updateHandler}
                            style={{width: "100%", height: "90%", color: 'black'}}
                        /> : <div>
                            <h1>Your Graphs are Loading</h1>
                            <img src={Images.loadingGif} alt='loading'/>
                        </div>}

                    </div>
                </div>

            </div>
        )
    }

}

export default GraphWidget;