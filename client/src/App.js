import React, { Component } from "react";
import LoginForm from './authentication/LoginForm'
// import WelcomeBoard from './WelcomeBoard'
// import Record from './Record'
import PrivateRoute from './authentication/PrivateRoute'
import AuthPages from './AuthPages'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";



class App extends Component {
  constructor(props) {
    super(props)
    this.callBackendAPI = this.callBackendAPI.bind(this)
    this.state = {
      data: null
    }
  }
  // Code used to call backend API:

  componentDidMount() {
    // this.callBackendAPI()
    // .then(res => {
    //   this.setState({ data: res.express })
    // })
    // .catch(err => console.log(err));

  }

  callBackendAPI = async () => {
    const response = await fetch('/api');
    const body = await response.json();
    console.log("Response body: ", body)
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
    <div className="App">
      <div className="InnerApp">

      <Router>
        <Switch>
          <Route exact path="/" component={LoginForm} />
          <PrivateRoute path="/api">
            <AuthPages />
          </PrivateRoute>
        </Switch>
      </Router>
      </div>
    </div>);
  }
}

export default App;