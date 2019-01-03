
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as d3 from 'd3-format'
import { Hint, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, HorizontalBarSeriesCanvas, VerticalBarSeriesCanvas } from 'react-vis';

class MessagesPerPerson extends React.Component {
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
                    onMouseLeave={() => {
                        this.setState({ hintDatapoint: null })
                    }}
                    width={window.innerWidth * 0.85}
                    height={window.innerHeight * 0.85}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis tickFormat={tick => d3.format('.2s')(tick)} />
                    <VerticalBarSeriesCanvas
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
        {
            "title": "Sender", "value": datapoint.x
        },
        {
            "title": "Messages", "value": datapoint.y
        }
    ]
}
function transformData(data) {
    let participants = {};
    data["participants"].forEach(function (participant) {
        participants[participant["name"]] = 0;
    })
    data["messages"].forEach(function (message) {
        participants[message["sender_name"]]++;
    })
    let dataOut = [];
    Object.keys(participants).forEach(function (participant) {
        dataOut.push({ y: participants[participant], x: participant });
    })
    return dataOut;
}
export default MessagesPerPerson;