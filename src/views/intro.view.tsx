import React, { CSSProperties } from 'react';
import { Button } from 'reactstrap';
import { Platform } from '../utils/constant';
import { View } from './view';

export class Intro extends View {

    handleClick = async (e:any) => {
        if (e.target.name === 'react') {
            this.mainCtrl.init(Platform.React);
            if (this.props.history) this.props.history.push('/home');
        } else if (e.target.name === 'react-native') {
            this.mainCtrl.init(Platform.ReactNative);
            if (this.props.history) this.props.history.push('/home');
        } else if (e.target.name === 'load') {
            const result = await this.mainCtrl.import();
            if (this.props.history && result) this.props.history.push('/home');
        } else if (e.target.name === 'dev') {
            this.props.history.push('/dev')
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
                <div><Button style={styles.button} color="info" name="dev" onClick={this.handleClick}>DEV LAB</Button></div>
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