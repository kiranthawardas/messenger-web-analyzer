
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as d3 from 'd3-format'
import { XYPlot, XAxis, YAxis, HeatmapSeries, Hint } from 'react-vis';

const DAYS = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const HOURS = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
    "12 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM", "12 PM"];

class DayAndTimeHeatmap extends React.Component {
    // All this stuff is pretty boilerplate except for the hintDatapoint state element which is used for this react-vis element
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            hintDatapoint: null
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
                    height={window.innerHeight * 0.85}
                    xDomain={[0, 23]}
                    yDomain={[0, 6]}>
                    <XAxis
                        xDomain={[0, 23]}
                        tickTotal={24}
                        tickLabelAngle={-45}
                        tickFormat={value => HOURS[value]} />
                    <YAxis
                        yDomain={[0, 6]}
                        tickTotal={7}
                        tickFormat={value => DAYS[value]} />
                    <HeatmapSeries
                        colorRange={["#f4f9ff", "#003268"]}
                        xDomain={[0, 23]} yDomain={[0, 6]}
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
    return [
        { "title": "Day", "value": DAYS[datapoint.y] },
        { "title": "Hour", "value": HOURS[datapoint.x] },
        { "title": "Messages", "value": datapoint.color }
    ]
}

function transformData(data) {
    let transform = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} };
    data["messages"].forEach(function (message) {
        var date = new Date(message["timestamp_ms"]);
        if (transform[date.getDay()][date.getHours()] == null) {
            transform[date.getDay()][date.getHours()] = 0;
        }
        transform[date.getDay()][date.getHours()]++;
    })
    let dataOut = [];
    Object.keys(transform).forEach(function (day) {
        Object.keys(transform[day]).forEach(function (hour) {
            dataOut.push({ y: day, x: hour, color: transform[day][hour] });
        })
    })
    return dataOut;
}
export default DayAndTimeHeatmap;