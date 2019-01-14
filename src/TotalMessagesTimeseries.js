
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as d3 from 'd3-format'
import moment from 'moment'
import DistinctColors from 'distinct-colors'
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, DiscreteColorLegend, Crosshair, LineMarkSeries } from 'react-vis';

class TotalMessagesTimeseries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hintDatapoint: {},
            senderData: null,
            totalData: null,
            topSenders: [],
            palette: null
        }
        this.renderSeries = this.renderSeries.bind(this);
        this.renderLegend = this.renderLegend.bind(this);
        this.renderCrosshair = this.renderCrosshair.bind(this);
    }

    componentDidMount() {
        transformData(this, this.props.data);
    }

    // ensures that component updates as data is taken in from file
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            transformData(this, this.props.data);
        }
    }

    render() {
        if (!this.props.data) {
            return null;
        }
        return (
            <div className="visualization-with-legend">
                <XYPlot
                    xType="time"
                    width={window.innerWidth * 0.8}
                    height={window.innerHeight * 0.85}
                    onMouseLeave={() => {
                        this.setState({ hintDatapoint: null })
                    }}
                >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis
                        tickTotal={3} />
                    <YAxis tickFormat={tick => d3.format('.2s')(tick)} />
                    {this.renderSeries()}
                    {this.renderCrosshair()}
                </XYPlot>
                {this.renderLegend()}
            </div>
        )
    }

    renderCrosshair() {
        if (this.state.hintDatapoint) {
            return (
                <Crosshair
                    values={crosshairValues(this, this.state.hintDatapoint)}
                    itemsFormat={crosshairItemsFormat}
                    titleFormat={crosshairTitleFormat}
                />
            )
        }
        else return null;
    }
    renderLegend() {
        if (this.state.topSenders.length > 0) {
            let items = [{ title: "Total", color: "#000000" }]
            for (let i = 0; i < this.state.topSenders.length; i++) {
                items.push({ title: this.state.topSenders[i], color: this.state.palette[i].css() })
            }
            return (
                <DiscreteColorLegend
                    orientation={'vertical'}
                    width={window.innerWidth * 0.2}
                    height={window.innerHeight * 0.85}
                    items={items}
                />
            )
        }
    }

    renderSeries() {
        if (!this.state.senderData || !this.state.totalData) return null;
        let _this = this;
        let retval = [];
        retval.push(
            <LineMarkSeries
                key="Total"
                onNearestX={(datapoint, info) => {
                    _onNearestX(_this, "Total", info.index);
                }}
                color="black"
                size={0}
                data={this.state.totalData} />
        )

        let i = 0;
        this.state.topSenders.forEach(function (sender) {
            retval.push(
                <LineMarkSeries
                    key={sender}
                    size={0}
                    color={_this.state.palette[i++]}
                    onNearestX={(datapoint, info) => {
                        _onNearestX(_this, sender, info.index);
                    }}
                    data={_this.state.senderData[sender]} />
            )
        })
        return retval;
    }

}


// TODO: save index, check in crosshairTitleFormat if date is right of crosshair date, 
//      if so, find closest datapoint before that date and use it instead
function _onNearestX(_this, sender, index) {
    let hintDatapoint = _this.state.hintDatapoint;
    if (!hintDatapoint) {
        hintDatapoint = {}
    }
    hintDatapoint[sender] = index;
    _this.setState({ hintDatapoint: hintDatapoint })
}

function crosshairTitleFormat(datapoint) {
    if (!moment(datapoint[0]["x"]).isValid()) {
        return ({})
    }
    return ({
        title: "Date", value: moment(datapoint[0]["x"]).format("MMM DD, YYYY")
    })
}

function crosshairItemsFormat(datapoints) {
    let format = d3.format(",");
    let retval = datapoints.map(function (datapoint) {
        return ({
            title: datapoint["sender"], value: (datapoint["y"])
        })
    })
    retval = retval.sort((a, b) => b["value"] - a["value"]);
    return retval.map(function (item) {
        return ({
            title: item["title"], value: format(item["value"])
        })
    })
}

function crosshairValues(_this, datapoint) {
    if (!datapoint || !datapoint["Total"]) {
        return []
    }
    let values = [];
    let totalDate = _this.state.totalData[datapoint["Total"]]["x"];
    values.push({ x: totalDate, y: _this.state.totalData[datapoint["Total"]]["y"], sender: "Total" });
    Object.keys(datapoint).forEach(function (sender) {
        if (sender !== "Total") {
            let index = datapoint[sender];
            while (index >= 0 && _this.state.senderData[sender][index]["x"] > totalDate) {
                index--;
            }
            if (index < 0) {
                values.push({ x: totalDate, y: 0, sender: sender })
            }
            else {
                values.push({ x: totalDate, y: _this.state.senderData[sender][index]["y"], sender: sender });
            }
        }
    })
    return values;
}

function transformData(_this, data) {
    if (data == null) return null;
    let totalData = [];
    let senderData = {}
    for (let i = data["messages"].length - 1; i >= 0; i--) {
        let date = moment(data["messages"][i]["timestamp_ms"]).millisecond(0).second(0).minute(0).hour(0);

        if (totalData.length === 0) {
            totalData.push({ x: date, y: 1 })
        }
        else if (totalData[totalData.length - 1]["x"].isSame(date)) {
            totalData[totalData.length - 1]["y"]++;
        }
        else {
            totalData.push({ x: date, y: totalData[totalData.length - 1]["y"] });
        }

        let sender = data["messages"][i]["sender_name"];
        if (!senderData[sender]) {
            senderData[sender] = [{ x: date, y: 1 }];
        }
        else if (senderData[sender][senderData[sender].length - 1]["x"].isSame(date)) {
            senderData[sender][senderData[sender].length - 1]["y"]++;
        }
        else {
            senderData[sender].push({ x: date, y: senderData[sender][senderData[sender].length - 1]["y"] + 1 });
        }
    }

    let topSenders = Object.keys(
        senderData).sort(
            (a, b) =>
                senderData[b][senderData[b].length - 1]["y"] -
                senderData[a][senderData[a].length - 1]["y"]);

    let palette = new DistinctColors({ count: topSenders.length, lightMin: 40, lightMax: 100 });
    _this.setState({ senderData: senderData, totalData: totalData, topSenders: topSenders, hintDatapoint: {}, palette: palette });
}
export default TotalMessagesTimeseries;