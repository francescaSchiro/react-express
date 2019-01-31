import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

const uploadEndpoint = 'http://localhost:8080/upload';
const getEndpoint = 'http://localhost:8080/files';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedFile: null,
      name: '',
      loaded: 0,
      list: 'no files yet',
      inputValue:'',
    };
  }

  // get uploaded file name list in componentDidMount()
  // componentDidMount() {
  //   // axios.get(getEndpoint)
  //   axios
  //     .get(getEndpoint)
  //     //handle success
  //     .then(res => this.setState({ list: res.data.list }))
  //     // handle error
  //     .catch(err => console.log(err));
  //     // always executed
  // }

  handleGetList = () => {
    axios
      .get(getEndpoint)
      //handle success
      .then(res=> {
        console.log(res.status);
        this.setState({ list: res.data.list })
      })
      // handle error
      .catch(err => console.log(err));
    // always executed ...
  };

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      name:  event.target.files[0].name,
      loaded: 0,
      
    });
    // this.clearFileInput("fileInput");

  };

  clearFileInput = (id) => {
    var oldInput = document.getElementById(id); 

    var newInput = document.createElement("input"); 

    newInput.type = "file"; 
    newInput.id = oldInput.id; 
    newInput.name = oldInput.name; 
    newInput.className = oldInput.className; 
    newInput.style.cssText = oldInput.style.cssText; 
    // TODO: copy any other relevant attributes 

    oldInput.parentNode.replaceChild(newInput, oldInput); 
  }

  handleUpload = () => {
    const data = new FormData();
    data.append('file', this.state.selectedFile, this.state.selectedFile.name);

    axios
      .post(uploadEndpoint, data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
            name: '',
          });
        }
      })
      .then(res => {
        console.log(res.statusText);
      });
      
  };

  render() {
    return (
      <div className='App'>
        <div>
          <input type='file' 
          name='fileInput' id='fileInput' 
          accept="image/png, image/jpeg"
          onChange={this.handleselectedFile} />

          <p>{this.state.name}</p>

          <button onClick={this.handleUpload} disabled={this.state.name === ''}>Upload</button>
        </div>

        <div> {Math.round(this.state.loaded, 2)} %</div>

        <button onClick={this.handleGetList} >getList</button>
        <div>{this.state.list}</div>
      </div>
    );
  }
}

export default App;
