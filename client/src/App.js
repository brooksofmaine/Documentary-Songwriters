import React, { Component } from "react";
import NavBar from './NavBar'
import LoginForm from './Authentication/LoginForm'
import './App.css'
class App extends Component {
  constructor(props) {
    super(props)
    this.callBackendAPI = this.callBackendAPI.bind(this)
    this.state = {
      data: null
    }
  }
  //TODO: Fetch in react component tree
  componentDidMount() {
    this.callBackendAPI()
    .then(res => this.setState({ data: res.express }))
    .catch(err => console.log(err));
  }

  callBackendAPI = async () => {
    const response = await fetch('/');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
    <div className="App">
      <NavBar />
      <LoginForm />
    </div>);
  }
}

export default App;