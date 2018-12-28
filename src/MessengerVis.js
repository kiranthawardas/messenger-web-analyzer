
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import MessagesPerPerson from './MessagesPerPerson.js'
import DayAndTimeHeatmap from './DayAndTimeHeatmap.js'

let fileReader;
const MENU_ITEMS = ["A", "B"] // Populates Navigation component

class MessengerVis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
        this.select = this.select.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({ data: this.props.data });
        }
    }
    select(item) {
        this.setState({ selection: item })
    }

    render() {
        if (this.props.data == null) {
            return null;
        }
        return (
            <div className="main-screen-wrapper">
                <Navigation
                    onSelect={this.select}
                />
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
function Navigation(props) {
    const listItems = MENU_ITEMS.map((item) =>
        <div
            key={item}
            className="item btn btn-outline-primary"
            onClick={() => { props.onSelect(item) }}>
            {item}
        </div>

    );
    return (
        <div className="navigation">
            {listItems}
        </div>
    )
}
function Visualization(props) {
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
        default:
            return null;

    }
}
export default MessengerVis;