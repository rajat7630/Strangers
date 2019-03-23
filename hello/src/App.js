import React, { Component } from 'react';
import axios from "axios";
import Handle from "./components/handle";
class App extends Component {
  componentWillMount(){
    
    axios.get("http://localhost:5000/")
    .then(response=>{
      console.log(response.data);
    })
  }
  render() {
    return (
      <div className="App">
        <Handle/>
      </div>
    );
  }
}

export default App;
