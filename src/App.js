
import React from 'react';
import MessengerVis from './MessengerVis.js'
import { Jumbotron } from 'react-bootstrap'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';

let fileReader;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            data: null,
            chatName: ""
        }
        this.onFileSelect = this.onFileSelect.bind(this)
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


    render() {
        return (
            <div>
                <ReselectBar
                    active={this.state.data !== null}
                    onChange={this.onFileSelect}
                    chatName={this.state.chatName}
                />
                <WelcomeScreen
                    active={this.state.file === null}
                    onChange={this.onFileSelect}
                />
                <MessengerVis
                    data={this.state.data}
                />
            </div>
        )
    }
}

function WelcomeScreen(props) {
    if (props.active) {
        return (
            <div className="welcome-style">
                <Jumbotron bsStyle="jumbotron-style">
                    <h1>Messenger Analyzer</h1>
                    <p>
                        Upload your messenger json file below to view stats about your messaging!
                    </p>
                    <span className="btn btn-outline-primary btn-file btn-lg">
                        Browse for Messenger JSON File<input onChange={props.onChange} type="file" />
                    </span>
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
                <h2 className="title">Messenger Analyzer</h2>
                <span className="btn btn-outline-primary btn-file btn-lg">
                    Browse <input onChange={props.onChange} type="file" />
                </span>
            </div>
        )
    }
    else {
        return null;
    }
}

export default App;