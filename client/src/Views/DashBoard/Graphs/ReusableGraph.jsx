import React, {Component} from 'react';
import SensorDataAPI from '../../../Data/sensorData-api';
import Plot from 'react-plotly.js';
import Constants from '../Constants/index';
import Images from "../../../Images";

class ReusableGraph extends Component {
    state = {
        data: [],
        selectorOptions: {},
        layout: {},
        loading: true,
        statusCode: 'status code will appear here'
    };

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
            title: this.props.sensorName
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
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.sensorId != prevProps.sensorId) {
            let layout = this.generateLayout();
            this.setState({
                loading: true,
                layout: layout
            });
            setTimeout(this.getData, Constants.timeoutAndIntervalSettings.graphTimeout);
        }
    };

    getData = () => {
        SensorDataAPI.getAll(this.props.sensorId).then(data => {
            if (data.data !== null || data.data !== undefined || data.data !== []) {
                console.log("Sensor Data: " + JSON.stringify(data.data.sensorData[0].y[0]));
                this.setState({
                    data: data.data.sensorData,
                    currentData: data.data.sensorData[0].y[0],
                    loading: false,
                    statusCode: `Temperature Status Code: ${data.status}  `
                });
            }
            ;
        });
    };
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
                    Sensor ID: {this.props.sensorId}
                    <span style={{ color: 'purple', fontWeight: 'bold'}}> - Current Value: {this.state.currentData} {this.props.units}</span>
                    {!this.state.loading ? <Plot

                        data={this.state.data}
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
