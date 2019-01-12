
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as d3 from 'd3-format'
import moment from 'moment'
import { XYPlot, XAxis, YAxis, HeatmapSeries, Hint } from 'react-vis';
const DAYS = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

class TotalMessagesHeatmap extends React.Component {
    // All this stuff is pretty boilerplate except for the hintDatapoint state element which is used for this react-vis element
    constructor(props) {
        super(props);
        this.state = {
            transformedData: transformData(this.props.data),
            hintDatapoint: {}
            // add state variables as needed
        }
        this.renderSeries = this.renderSeries.bind(this);
    }

    // ensures that component updates as data is taken in from file
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({ transformedData: transformData(this.props.data) });
        }
    }
    // end basic boilerplate stuff

    render() {
        if (this.props.data == null) {
            return null;
        }
        return (
            <div className="total-messages-heatmap-container">
                {this.renderSeries()}
            </div>
        )
    }

    renderSeries() {
        let _this = this;
        return Object.keys(this.state.transformedData).map(function (year) {
            return (
                <XYPlot
                    key={year}
                    // onMouseLeave={() => {
                    //     _this.setState({ hintDatapoint: null })
                    // }}
                    width={1000}
                    height={400}
                    xDomain={[1, 52]}
                    yDomain={[0, 6]}>
                    <XAxis
                        xDomain={[1, 52]}
                        tickTotal={52}
                        tickLabelAngle={-45}/>
                    <YAxis
                        yDomain={[0, 6]}
                        tickTotal={7} />
                    <HeatmapSeries
                        colorRange={["#f4f9ff", "#003268"]}
                        xDomain={[1, 52]} yDomain={[0, 6]}
                        data={_this.state.transformedData[year]}
                    />
                </XYPlot> 
            )
        })
    }
}

function formatHint(datapoint) {
    return []
    // let format = d3.format(",");
    // return [
    //     { "title": "Day", "value": DAYS[datapoint.y] },
    //     { "title": "Hour", "value": HOURS[datapoint.x] },
    //     { "title": "Messages", "value": format(datapoint.color) }
    // ]
}

function transformData(data) {
    let dataOut = {};
    for (let i = data["messages"].length - 1; i >= 0; i--) {
        let week = moment(data["messages"][i]["timestamp_ms"]).week();
        let year = moment(data["messages"][i]["timestamp_ms"]).year();
        let weekday = moment(data["messages"][i]["timestamp_ms"]).weekday();
        if (!dataOut[year]) {
            dataOut[year] = [{
                x: week,
                y: weekday,
                color: 1
            }];
        }
        else {
            let endOfArray = dataOut[year].length - 1;
            if (dataOut[year][endOfArray]["x"] === week
                && dataOut[year][endOfArray]["y"] === weekday) {
                dataOut[year][endOfArray]["color"]++;
            }
            else {
                dataOut[year].push({
                    x: week,
                    y: weekday,
                    color: 1
                })
            }
        }
    }
    console.log(dataOut)
    return dataOut;
}

export default TotalMessagesHeatmap;