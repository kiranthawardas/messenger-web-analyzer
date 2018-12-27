
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
            myData: null
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
                console.log(e.target.result);
                _this.setState({ data: JSON.parse(e.target.result) });
            };
        });
    }


    render() {
        console.log(this.state.myData);
        return (
            <div>
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
            <div className="welcomeStyle">
                <Jumbotron bsStyle="jumbotronStyle">
                    <h1>Messenger Analyzer</h1>
                    <p>
                        Upload your messenger json file below to view stats about your messaging!
                    </p>
                    <span className="btn btn-outline-primary btn-file btn-lg">
                        Browse <input onChange={props.onChange} type="file" />
                    </span>
                </Jumbotron>
            </div>
        )
    }
    else {
        return null;
    }
}

export default App;