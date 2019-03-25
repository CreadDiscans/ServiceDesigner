import React from 'react';
import { Button } from 'reactstrap';
import { DataManager } from '../manager/data.manager';
import { ElementManager } from '../manager/element.manager';
import { ShortcutService } from '../service/shortcut.service';
import comData from '../resource/components.json';
import initJson from '../resource/init.json';

export class Intro extends React.Component {
    
    handleClick = (e) => {
        if (e.target.name === 'react') {
            DataManager.getInstance(DataManager).projectType = 'react';
            DataManager.getInstance(DataManager).initialize(initJson);
            ElementManager.getInstance(ElementManager).initialize(comData);
            ShortcutService.getInstance(ShortcutService).initialize();
            this.props.history.push('/home');
        } else if (e.target.name === 'react-native') {
            DataManager.getInstance(DataManager).projectType = 'react-native';
            DataManager.getInstance(DataManager).initialize(initJson);
            ElementManager.getInstance(ElementManager).initialize(comData);
            ShortcutService.getInstance(ShortcutService).initialize();
            this.props.history.push('/home');
        } else if (e.target.name === 'load') {
            DataManager.getInstance(DataManager).import();
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

const styles = {
    title: {
        margin:100,
        textAlign:"center"
    },
    button: {
        margin:10
    }
}