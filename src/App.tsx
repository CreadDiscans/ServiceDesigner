import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './views/home'
import Sidebar from './views/sidebar/sidebar'
import { Intro } from './views/intro'

class App extends React.Component { 

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
