
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as d3 from 'd3-format'
import moment from 'moment'
import { XYPlot, XAxis, YAxis, HeatmapSeries, Hint } from 'react-vis';

const DAYS = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const HOURS = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
    "12 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM", "12 PM"];

class TotalMessagesHeatmap extends React.Component {
    // All this stuff is pretty boilerplate except for the hintDatapoint state element which is used for this react-vis element
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            hintDatapoint: {}
            // add state variables as needed
        }
    }

    // ensures that component updates as data is taken in from file
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({ data: this.props.data });
        }
    }
    // end basic boilerplate stuff

    render() {
        if (this.props.data == null) {
            return null;
        }
        return (
            <div>
                <XYPlot
                    onMouseLeave={() => {
                        this.setState({ hintDatapoint: null })
                    }}
                    width={window.innerWidth * 0.85}
                    height={window.innerHeight * 0.85}>
                    <XAxis
                        tickLabelAngle={-45} />
                    <YAxis />
                    <HeatmapSeries
                        colorRange={["#f4f9ff", "#003268"]}
                        data={transformData(this.state.data)}
                        onNearestXY={(datapoint, event) => {
                            this.setState({
                                hintDatapoint: datapoint
                            });
                        }}
                    />
                    {this.state.hintDatapoint ?
                        <Hint value={this.state.hintDatapoint} format={formatHint}></Hint> : null}
                </XYPlot>
            </div>
        )
    }
}

function formatHint(datapoint) {
    let format = d3.format(",");
    return [
        { "title": "Day", "value": DAYS[datapoint.y] },
        { "title": "Hour", "value": HOURS[datapoint.x] },
        { "title": "Messages", "value": format(datapoint.color) }
    ]
}

function transformData(data) {
    // let date = moment(data["messages"][data["messages"].length - 1]["timestamp_ms"]).millisecond(0).second(0).minute(0).hour(0);
    let dataOut = [];
    let minYear = moment(data["messages"][data["messages"].length - 1]["timestamp_ms"]).year();
    for (let i = data["messages"].length - 1; i >= 0; i--) {

        let week = moment(data["messages"][i]["timestamp_ms"]).week();
        let year = moment(data["messages"][i]["timestamp_ms"]).year();
        week += (year - minYear) * 52;
        if (dataOut.length > 0) {
            if (dataOut[dataOut.length - 1]["x"] === week
                && dataOut[dataOut.length - 1]["y"] === moment(data["messages"][i]["timestamp_ms"]).weekday()) {
                dataOut[dataOut.length - 1]["color"]++;
            }
            else {
                dataOut.push({
                    x: week,
                    y: moment(data["messages"][i]["timestamp_ms"]).weekday(),
                    color: 1
                })
            }
        }
        else {
            dataOut.push({
                x: week,
                y: moment(data["messages"][i]["timestamp_ms"]).weekday(),
                color: 1
            })
        }
    }
    console.log(dataOut)
    return dataOut;
}

export default TotalMessagesHeatmap;