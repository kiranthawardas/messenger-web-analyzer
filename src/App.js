
import React from 'react'
import { Form, ControlLabel } from 'react-bootstrap'
import axios, { post } from 'axios';
import { Button, InputGroup, FormControl } from 'react-bootstrap'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

let fileReader;
const globalStyle = {
  fontSize: '100%'
}
const uploadStyle = {
  maxWidth: '30rem',
  marginRight: '1rem'
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      data: null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleFileRead = this.handleFileRead.bind(this)
    this.doSomething = this.doSomething.bind(this);
  }
  onFormSubmit(e) {
    if (this.state.file == null) {
      alert("no file selected");
      return;
    }
    e.preventDefault();
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
      _this.handleFileRead(e.target.result);
    };
  }
  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }
  handleFileRead(data) {
    console.log(data);
    this.setState({ data: JSON.parse(data) }, function () {
      this.doSomething();
    });
  }
  doSomething() {

  }

  render() {
    return (
      <div style={globalStyle}>
        <form onSubmit={this.onFormSubmit}>
          <div style={uploadStyle} className="custom-file">
            <input type="file" className="custom-file-input" id="customFile" onChange={this.onChange}></input>
            <label className="custom-file-label" htmlFor="customFile">Choose file</label>
          </div>
          <button className="btn-primary">Show</button>
        </form>
        <p>{JSON.stringify(this.state.data)}</p>
      </div>
    )
  }
}

export default App;