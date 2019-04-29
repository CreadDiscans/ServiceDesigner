import React, { CSSProperties } from 'react';
import { Button } from 'reactstrap';
import { DataManager } from '../manager/data.manager';
import { ElementManager } from '../manager/element.manager';
import comData from '../resource/components.json';
import { Platform } from '../utils/constant';
import { MainController } from '../controllers/main.controller';
import { IProps } from '../utils/interface';
import { View } from './view';

export class Intro extends View {
    
    // react_init = {
    //     '/home.js': {
    //         "id": 0,
    //         "component":"layout",
    //         "import":[],
    //         "code":"<div className={{class}} style={{style}}>{children}</div>",
    //         "style":"style{\n\n}",
    //         "property":{"class":""},
    //         "state": {},
    //         "children":[]        
    //     }
    // }

    // react_native_init = {
    //     '/home.js': {
    //         "id": 0,
    //         "component":"View",
    //         "import":[{from:"react-native", items:['View']}],
    //         "code":"<View style={{style}}>{children}</View>",
    //         "style":"style{\n\n}",
    //         "property":{"class":""},
    //         "state":{},
    //         "children":[]
    //     }
    // }

    handleClick = async (e:any) => {
        if (e.target.name === 'react') {
            this.mainCtrl.init(Platform.React);

            // this.dataManager.projectType = 'react';
            // this.dataManager.initialize(this.react_init);
            // this.elementManager.initialize(comData);
            if (this.props.history) this.props.history.push('/home');
        } else if (e.target.name === 'react-native') {
            this.mainCtrl.init(Platform.ReactNative);
            
            // this.dataManager.projectType = 'react-native';
            // this.dataManager.initialize(this.react_native_init);
            // this.elementManager.initialize(comData);
            if (this.props.history) this.props.history.push('/home');
        } else if (e.target.name === 'load') {
            const result = await this.mainCtrl.import();
            if (this.props.history && result) this.props.history.push('/home');
        }
    }

    render() {
        return <div>
            <div style={styles.title}>
                <h3>Welcome to Service Designer.</h3>
                <p>This is UI designer for react, react-native project.</p>
            </div>
            <div style={{textAlign:"center"}}>
                <Button style={styles.button} color="info" name="react" onClick={this.handleClick}>React</Button>
                <Button style={styles.button} color="info" name="react-native" onClick={this.handleClick}>React Native</Button>
                <Button style={styles.button} color="info" name="load" onClick={this.handleClick}>Load Design</Button>
            </div>
        </div>
    }
}

const styles:{[s: string]: CSSProperties;} = {
    title: {
        margin:100,
        textAlign:"center"
    },
    button: {
        margin:10
    }
};