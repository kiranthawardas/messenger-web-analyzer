
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import HeatMap from 'react-heatmap-grid'
import moment from 'moment'

moment.locale('en-us')
const yLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

class TotalMessagesHeatmap extends React.Component {
    // All this stuff is pretty boilerplate except for the hintDatapoint state element which is used for this react-vis element
    constructor(props) {
        super(props);
        this.state = {
            transformedData: transformData(this.props.data),
            hintDatapoint: {},
            year: ""
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
        return (this.renderSeries())
    }

    renderSeries() {
        let _this = this;
        let series = Object.keys(this.state.transformedData).map(function (year) {
            console.log(_this.state.transformedData[year][0].length)
            let xLabels = new Array(53).fill("");
            for (let i = 0; i < 12; i++) {
                let weekNum = moment().year(year).month(i).date(1).week() - 1;
                xLabels[weekNum] = MONTHS[i];
            }
            return (
                <div className="total-messages-heatmap-container">
                    <h4 key={year + "header"}>{year}</h4>
                    <HeatMap
                        key={year}
                        background="#003268"
                        xLabels={xLabels}
                        yLabels={yLabels}
                        xLabelsLocation={"bottom"}
                        unit="messages"
                        data={_this.state.transformedData[year]}
                        onMouseOver={(x, y) => alert(`Clicked ${x}, ${y}`)}
                    />
                </div>
            )
        })
        return series;
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
        let year = moment(data["messages"][i]["timestamp_ms"]).year();
        let weekday = moment(data["messages"][i]["timestamp_ms"]).weekday();
        let week = moment(data["messages"][i]["timestamp_ms"]).week() - 1;
        if (year !== moment(data["messages"][i]["timestamp_ms"]).weekYear()) {
            week = 52;
        }
        if (!dataOut[year]) {
            let endOfYear = moment().year(year).month(11).day(31);
            let weeksInYear = 52;
            if (endOfYear.weekYear() !== year) {
                weeksInYear = 53;
            }
            dataOut[year] = new Array(yLabels.length)
                .fill(0)
                .map(() => new Array(weeksInYear).fill(0));
        }
        dataOut[year][weekday][week]++;
    }
    return dataOut;
}

export default TotalMessagesHeatmap;