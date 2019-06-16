import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './views/home.view'
import Sidebar from './views/sidebar/sidebar.view'
import { Intro } from './views/intro.view'
import { FrameView } from './views/frame.view';
import { HomeView } from './layout/Home.view';
import { Menu } from './utils/Menu';
import { connectRouter } from './redux/connection';


class App extends React.Component { 

    componentWillMount() {
        new Menu().init(
            (data) => {console.log(data)},  // load File : input data
            () => {
                return {
                    json:'',
                    js: '',
                    css: ''
                }
            }                        // save File : return {json, js, css}
        )
    }

    render() {
        return (
        <div>
            <Switch>
                <Route exact path="/dev"  component={HomeView} />
                <Route exact path="/frame" component={FrameView} />
                <Route path="*" render={()=> 
                    <Sidebar>
                    <Switch>
                        <Route exact path="/intro" component={Intro} />
                        <Route exact path="/home" component={Home} />
                        <Route path="*" render={() => (<Redirect to="/intro" />)} />
                    </Switch>
                    </Sidebar>
                } />
            </Switch>
        </div>
        );
    }
}

export default connectRouter(
    (state)=>({}),
    (dispatch)=>({}),
    App
);
