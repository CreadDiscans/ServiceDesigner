import React, { CSSProperties } from 'react';
import CodeSandbox from 'react-code-sandbox'
import { Platform } from '../utils/constant';
import { View } from './view';
import { Subscription } from 'rxjs';

export default class Home extends View {

    subscription?:Subscription;

    componentWillMount() {
        if (!this.mainCtrl.isInitialized()) {
            if(this.props.history) this.props.history.push('/');
            return;
        }
    }

    componentDidMount() {
        this.subscription = this.mainCtrl.home$.subscribe(()=> this.setState({}));
    }

    componentWillUnmount() {
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    componentDidCatch() {
        console.log('error catch');
    }

    render() {
        if (!this.mainCtrl.isInitialized()) {
            return <div></div>
        }
        return <div id="design">
            { this.mainCtrl.getPlatform() === Platform.ReactNative && <img style={{height:'100vh'}} src="/frame.jpg" /> }
            <div style={(this.mainCtrl.getPlatform() === Platform.ReactNative) ? styles.mobile : {}}>
                {this.sandbox()}
            </div>
        </div>
    }

    sandbox() {
        const data = this.mainCtrl.getRenderData();
        return <CodeSandbox imports={data.imp}>
        {'state='+JSON.stringify(data.state)+';renderPart=(name)=>{};handleChange=(e)=>{};render(' +data.code + ')'}
        </CodeSandbox>
    }
}

const styles:{[s: string]: CSSProperties;} = {
    mobile: {
        width: '42.5vh',
        position: 'absolute',
        top: '12%',
        bottom: '12.5%',
        left: '3vh',
        overflow: 'auto'
    }
}