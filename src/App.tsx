import React from 'react';
import logo from './logo.svg';
import './App.css';

interface Props {}
interface State {}

class App extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div>
        <p>Hi!!!</p>
      </div>
    );
  }
}

export default App;
