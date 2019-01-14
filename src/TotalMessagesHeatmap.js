
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import HeatMap from './react-heatmap-grid/index.js'
import moment from 'moment'

moment.locale('en-us')
const yLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

class TotalMessagesHeatmap extends React.Component {
    // All this stuff is pretty boilerplate except for the hintDatapoint state element which is used for this react-vis element
    constructor(props) {
        super(props);
        let obj = transformData(props.data)
        this.state = {
            transformedData: obj.dataOut,
            dates: obj.dates,
            hintDatapoint: {},
            modalCoords: null
            // add state variables as needed
        }
        this.cellHover = this.cellHover.bind(this);
    }

    // ensures that component updates as data is taken in from file
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            let obj = transformData(this.props.data);
            console.log(obj);
            this.setState({ transformedData: obj.dataOut, dates: obj.dates });
        }
    }
    // end basic boilerplate stuff

    render() {
        if (this.props.data == null) {
            return null;
        }
        return (
            <div>
                {this.renderSeries()}
            </div>
        )
    }

    renderSeries() {
        let _this = this;
        let series = Object.keys(this.state.transformedData).map(function (year) {
            let xLabels = new Array(53).fill("");
            for (let i = 0; i < 12; i++) {
                let weekNum = moment().year(year).month(i).date(1).week() - 1;
                xLabels[weekNum] = MONTHS[i];
            }
            return (
                <div key={year} className="total-messages-heatmap-container">
                    <h4 key={year + "div"}>
                        <span>
                            {year}
                        </span>
                        {_this.state.hoverInfo && _this.state.hoverInfo.year === year ?
                            <span className="header-data">
                                {_this.state.hoverInfo.count + " messages on " + moment(_this.state.hoverInfo.date).format("dddd, MM/DD/YY")}
                            </span>
                            : null}
                    </h4>
                    <HeatMap
                        key={year}
                        background="#003268"
                        xLabels={xLabels}
                        yLabels={yLabels}
                        xLabelsLocation={"bottom"}
                        unit={"messages" + (_this.state.hoverInfo && _this.state.hoverInfo.year === year ? " on " + moment(_this.state.hoverInfo.date).format("dddd, MM/DD/YY") : "")}
                        onClick={(x, y) => _this.setState({ modalCoords: { x: x, y: y, year: year }, modalOpen: true })}
                        data={_this.state.transformedData[year]}
                        onMouseOver={(x, y) => _this.cellHover(year, x, y)}
                    />
                </div>
            )
        })
        return series;
    }

    cellHover(year, x, y) {
        if (this.state.dates[year][y][x] === 0) {
            return null;
        }
        else {
            let obj =
            {
                date: this.state.dates[year][y][x],
                year: year,
                count: this.state.transformedData[year][y][x]
            }
            this.setState({ hoverInfo: obj })
        }
    }

}

function transformData(data) {
    if (!data) return { dataOut: null, dates: null }
    let dataOut = {};
    let dates = {};
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
            dates[year] = new Array(yLabels.length)
                .fill(0)
                .map(() => new Array(weeksInYear).fill(0));
        }
        dataOut[year][weekday][week]++;
        dates[year][weekday][week] = moment(data["messages"][i]["timestamp_ms"]).hour(0).minute(0).second(0).millisecond(0);
    }
    return { dataOut: dataOut, dates: dates };
}

export default TotalMessagesHeatmap;