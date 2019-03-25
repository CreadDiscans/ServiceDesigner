import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './component/home';
import Sidebar from './component/sidebar/sidebar';
import { Intro } from './component/intro';

class App extends Component { 

    render() {
        return (
        <div>
            <Sidebar>
                <Switch>
                    <Route exact path="/intro" component={Intro} />
                    <Route exact path="/home" component={Home} />
                    <Route path="*" render={() => (<Redirect to="/intro" />)} />
                </Switch>
            </Sidebar>
        </div>
        );
    }
}

export default App;
