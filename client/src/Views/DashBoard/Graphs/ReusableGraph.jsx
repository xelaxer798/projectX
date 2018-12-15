import React, {Component} from 'react';
import SensorDataAPI from '../../../Data/sensorData-api';
import Plot from 'react-plotly.js';
import Constants from '../Constants/index';
import Images from "../../../Images";

class ReusableGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data1: [],
            selectorOptions: {},
            layout: {},
            loading1: true,
            loading2: true,
            statusCode: 'status code will appear here'
        };

        this.conCatData = this.conCatData.bind(this);
        // this.onSliderChange = this.onSliderChange.bind(this);
    }

    generateLayout = () => {
        let layout = {
            width: 575,
            height: 700,
            margin: {
                // l: 50,
                // r: 50,
                // b: 100,
                // t: 100,
                pad: 1
            },
            showlegend: false,
            yaxis: {
                title: this.props.units
            },
            xaxis: {
                tickfont: {
                    family: 'Old Standard TT, serif',
                    size: 12,
                    color: 'black'
                }, ticks: 'outside', rangeselector: Constants.selectorOptions,
                rangeslider: {}, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
            },
        };
        return layout;
    };

    componentDidMount = () => {
        let layout = this.generateLayout();
        this.setState({
            selectorOptions: Constants.selectorOptions,
            layout: layout
        });
        console.log("component did mount");
        setTimeout(this.getData, Constants.timeoutAndIntervalSettings.graphTimeout);
        setInterval(this.getData, Constants.timeoutAndIntervalSettings.graphUpdateInterval);
        setTimeout(this.getData2, Constants.timeoutAndIntervalSettings.graphTimeout);
        setInterval(this.getData2, Constants.timeoutAndIntervalSettings.graphUpdateInterval);
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.sensorId != prevProps.sensorId) {
            let layout = this.generateLayout();
            this.setState({
                loading1: true,
                layout: layout
            });
            setTimeout(this.getData, Constants.timeoutAndIntervalSettings.graphTimeout);
            setTimeout(this.getData2, Constants.timeoutAndIntervalSettings.graphTimeout);
        }
    };

    getData = () => {
        SensorDataAPI.getAll(this.props.sensorId).then(data => {
            if (data.data !== null || data.data !== undefined || data.data !== []) {
                // console.log("Sensor Data: " + JSON.stringify(data.data.sensorData[0].y[0]));
                data.data.sensorData[0].name = this.props.sensorId;
                this.setState({
                    data1: data.data.sensorData,
                    currentData1: data.data.sensorData[0].y[0],
                    loading1: false,
                    statusCode: `Temperature Status Code: ${data.status}  `
                });
            }
            ;
        });
    };

    getData2 = () => {
        const sensorId = "4564C02DE6B4-TempF";
        SensorDataAPI.getAll(sensorId).then(data => {
            if (data.data !== null || data.data !== undefined || data.data !== []) {
                console.log("Sensor Data: " + JSON.stringify(data.data.sensorData[0].y[0]));
                data.data.sensorData[0].marker = {color: 'blue'};
                data.data.sensorData[0].name = sensorId;
                this.setState({
                    data2: data.data.sensorData,
                    currentData2: data.data.sensorData[0].y[0],
                    loading2: false,
                    statusCode: `Temperature Status Code: ${data.status}  `
                });
            }
            ;
        });
    };

    conCatData = () => {
        let returnData = [];
        returnData.push(this.state.data1[0]);
        returnData.push(this.state.data2[0]);
        return returnData;
    }

    onSliderChange = (figure) => {
        console.log("Figure: " + JSON.stringify(figure.data[0].x.length ));
        // console.log("Graph DIV: " + JSON.stringify(graphDiv));
    }


//   render() {
//     return(
//     <div>
//       Hello world
//     </div>
//     )
//   }
// }
    render() {
        return (
            <div>
                <div style={{paddingLeft: '10px', color: 'black'}}>
                    <span style={{ color: 'blue', fontWeight: 'bold'}}>Sensor ID: {this.props.sensorId}</span>
                    <span style={{ color: 'purple', fontWeight: 'bold'}}> - Current Value: {this.state.currentData1} {this.props.units}</span>
                    {!this.state.loading1 && !this.state.loading2 ? <Plot

                        data={this.props.graphData}
                        onSelected={this.onSliderChange}
                        layout={this.state.layout}
                    /> : <div>
                        <h1>Your Graphs are Loading</h1>
                        <img src={Images.loadingGif} alt='loading'/>
                    </div>}

                </div>
            </div>

        );
    };
};
export default ReusableGraph;
