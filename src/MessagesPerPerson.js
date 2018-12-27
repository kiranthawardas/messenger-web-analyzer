
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as d3 from 'd3-format'
import { Hint, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, HorizontalBarSeriesCanvas, VerticalBarSeriesCanvas } from 'react-vis';

let fileReader;
const MENU_ITEMS = ["A", "B", "C"]

class MessagesPerPerson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            hintDatapoint: null
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({ data: this.props.data });
        }
    }

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
                    <XAxis />
                    <YAxis tickFormat={tick => d3.format('.2s')(tick)} />
                    <VerticalBarSeriesCanvas
                        onNearestX={(datapoint, event) => {
                            this.setState({ hintDatapoint: datapoint });
                        }}
                        data={transformData(this.state.data)} />
                    {this.state.hintDatapoint ? <Hint value={this.state.hintDatapoint} /> : null}
                </XYPlot>
            </div>
        )
    }
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
    let i = 0;
    Object.keys(participants).forEach(function (participant) {
        dataOut.push({ y: participants[participant], x: participant });
    })
    return dataOut;
}
export default MessagesPerPerson;