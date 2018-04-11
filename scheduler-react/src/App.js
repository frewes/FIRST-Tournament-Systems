import React, { Component } from 'react';
import BasicInputForm from './inputs/InitForm'
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'LoadNew',
        };
        // This binding is necessary to make `this` work in the callback
        this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
        this.handleLoadButtonClick = this.handleLoadButtonClick.bind(this);
    }

    handleLoadButtonClick() {
        alert("Loading not yet implemented");
    }

    handleCreateButtonClick() {
        this.setState({value: 'Initialise'});
    }

    render() {
        let mainWindow = <h1>An error occurred</h1>;
        if (this.state.value === 'LoadNew') {
            mainWindow = (
                <div>
                    <button onClick={this.handleCreateButtonClick}>Create new schedule</button>&nbsp;
                    <button onClick={this.handleLoadButtonClick}>Load existing schedule</button>
                </div>
            );
        } else if (this.state.value === 'Initialise') {
            mainWindow = (
                <div>
                    <h1 className="App-intro">
                        Basic setup
                    </h1>
                    <BasicInputForm/>
                </div>
            );
        }

        return (
          <div className="App">
            <header className="App-header">
                <h1 className="App-title">FLL Scheduler</h1>
                <h3>Version {this.props.version}</h3>
            </header>
              {mainWindow}
          </div>
        );
  }
}

export default App;
