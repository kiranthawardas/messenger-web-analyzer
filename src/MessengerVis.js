
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import MessagesPerPerson from './MessagesPerPerson.js'
import DayAndTimeHeatmap from './DayAndTimeHeatmap.js'
import TotalMessagesTimeseries from './TotalMessagesTimeseries.js'
import TotalMessagesHeatmap from './TotalMessagesHeatmap.js'
import WordFrequency from './WordFrequency.js'

const MENU_ITEMS = ["A", "B", "C", "D", "E"] // Populates Navigation component

class MessengerVis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            selection: props.visualization
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({ data: this.props.data, selection: this.props.visualization });
        }
    }

    render() {
        if (this.props.data == null) {
            return null;
        }
        return (
            <div className="main-screen-wrapper">
                <div className="visualization-wrapper">
                    <Visualization
                        selection={this.state.selection}
                        data={this.state.data}
                    />
                </div>
            </div>
        )
    }
}
function Visualization(props) {
    if (!props.data) return null;
    switch (props.selection) {
        case "A":
            return (
                <MessagesPerPerson
                    data={props.data}
                />
            );
        case "B":
            return (
                <DayAndTimeHeatmap
                    data={props.data}
                />
            );
        case "C":
            return (
                <WordFrequency
                    data={props.data}
                />
            )
        case "D":
            return (
                <TotalMessagesTimeseries
                    data={props.data}
                />
            )
        case "E":
            return (
                <TotalMessagesHeatmap
                    data={props.data}
                />
            )
        default:
            return (
                <TotalMessagesHeatmap
                    data={props.data}
                />
            )

    }
}


export default MessengerVis;