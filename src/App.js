import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './component/layout/header';
import Home from './component/home';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          {this.state.isLogined && <Route exact={true} path="/next" component={Next} />} */}
          <Route path="*" render={() => (<Redirect to="/" />)} />
        </Switch>
      </div>
    );
  }
}

export default App;
