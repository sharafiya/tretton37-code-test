import React, { Component } from "react";
import { Provider } from "react-redux";
import  Main  from "./components/Main";

class App extends Component {
  render() {
    return (
        <div>
          <Main />
        </div>
    );
  }
}

export default App;
