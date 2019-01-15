
import React from 'react';
import MessengerVis from './MessengerVis.js'
import { Jumbotron } from 'react-bootstrap'
import 'bootstrap/dist/js/bootstrap';
import 'jquery';
import './style.css';

const MENU_ITEMS = ["Total Messages Heatmap", "Messages per Person", "Day/Time Heatmap", "Word Frequency", "Total Messages Timeseries"] // Populates Navigation component

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            data: null,
            chatName: "",
            visualization: "Total Messages Heatmap"
        }
        this.onFileSelect = this.onFileSelect.bind(this);
        this.onVisualizationSelect = this.onVisualizationSelect.bind(this);
    }

    componentDidMount() {
        document.title = "Messenger Web Analyzer"
    }

    render() {
        return (
            <div>
                <ReselectBar
                    active={this.state.data !== null}
                    onChangeFile={this.onFileSelect}
                    onChangeVisualization={this.onVisualizationSelect}
                    chatName={this.state.chatName}
                    visualization={this.state.visualization}
                />
                <WelcomeScreen
                    active={this.state.file === null}
                    onChange={this.onFileSelect}
                />
                <MessengerVis
                    data={this.state.data}
                    visualization={this.state.visualization}
                />
            </div>
        )
    }

    onFileSelect(e) {
        this.setState({ file: e.target.files[0] }, function () {

            var fr = new FileReader();
            const _this = this;
            try {
                fr.readAsText(this.state.file);
            }
            catch (e) {
                alert("invalid file");
                return;
            }
            fr.onload = function (e) {
                let data = JSON.parse(e.target.result);
                _this.setState({ data: data, chatName: data.title });

            };
        });
    }
    onVisualizationSelect(visualization) {
        this.setState({ visualization: visualization })
    }
}

function WelcomeScreen(props) {
    if (props.active) {
        return (
            <div className="welcome-style">
                <Jumbotron bsStyle="jumbotron-style">
                    <h1>Messenger Analyzer</h1>
                    <p>
                        <b>Analyze and visualize your Facebook messenger chats!</b><br></br><br></br>
                    </p>
                    <span className="btn btn-outline-primary btn-file btn-lg">
                        Browse for Messenger JSON File<input onChange={props.onChange} type="file" />
                    </span>
                    <ol className="instructions">
                        <lh><b>To download your messenger json file</b></lh>
                        <li>Go to <u>Facebook Settings</u></li>
                        <li>Select <u>Your Facebook Information</u></li>
                        <li>Select <u>Download Your Information</u></li>
                        <li>Set Format to <u>JSON</u></li>
                        <li>Select <u>Create File</u></li>
                        <li>Wait for file to be generated and unzip</li><br></br>
                        <li>Go to the messenger folder, and then the inbox folder</li>
                        <li>Select the chat you want to analyze and upload message.json</li>
                    </ol>
                </Jumbotron>
            </div>
        )
    }
    else {
        return null;
    }
}
function ReselectBar(props) {
    if (props.active) {
        let displayChatName;
        if (props.chatName) {
            if (props.chatName.length > 20) {
                displayChatName = props.chatName.substring(0, 20) + "...";
            }
            else {
                displayChatName = props.chatName;
            }
        }
        return (
            <div className="reselect-bar">
                {displayChatName && <h2 className="chat-name" title={props.chatName}>{displayChatName}</h2>}
                <div className="dropdown">
                    <button
                        className="btn btn-outline-primary btn-file btn-lg dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        {props.visualization}
                    </button>
                    <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                    >
                        {MENU_ITEMS.map((item) =>
                            <div
                                key={item}
                                onClick={() => props.onChangeVisualization(item)}
                                className="dropdown-item"
                                href="#">
                                {item}
                            </div>
                        )}
                    </div>
                </div>
                <span className="btn btn-outline-primary btn-file btn-lg">
                    Browse <input onChange={props.onChangeFile} type="file" />
                </span>
            </div>
        )
    }
    else {
        return null;
    }
}

export default App;