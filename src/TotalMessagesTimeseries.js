
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as d3 from 'd3-format'
import { Hint, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, HorizontalBarSeriesCanvas, VerticalBarSeriesCanvas, LineSeries, LineMarkSeries } from 'react-vis';

class TotalMessagesTimeseries extends React.Component {
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
                <XYPlot xType={'ordinal'}
                    width={window.innerWidth * 0.85}
                    height={500}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis
                        tickTotal={3} />
                    <YAxis tickFormat={tick => d3.format('.2s')(tick)} />
                    <LineMarkSeries
                        onNearestX={(datapoint, event) => {
                            this.setState({ hintDatapoint: datapoint });
                        }}
                        data={transformData(this.state.data)} />
                    {this.state.hintDatapoint ? <Hint value={this.state.hintDatapoint} format={formatHint} /> : null}
                </XYPlot>
            </div>
        )
    }
}

function formatHint(datapoint) {
    return [
        // {
        //     "title": "Sender", "value": datapoint.x
        // },
        // {
        //     "title": "Messages", "value": datapoint.y
        // }
    ]
}
function transformData(data) {
    let transform = [];
    let count = 0;
    data["messages"].forEach(function (message) {
        count++;
        let date = new Date(message["timestamp_ms"])
        transform.push({ x: date, y: count });
    })
    return transform;
}
export default TotalMessagesTimeseries;