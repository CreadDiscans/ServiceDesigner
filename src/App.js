import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './component/home';
import Sidebar from './component/sidebar/sidebar';
import DataService from './service/data.service';

class App extends Component {

    componentDidMount() {
        DataService.inialize()
    }

    render() {
        return (
        <div>
            <Sidebar>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="*" render={() => (<Redirect to="/" />)} />
                </Switch>
            </Sidebar>
        </div>
        );
    }
}

export default App;
