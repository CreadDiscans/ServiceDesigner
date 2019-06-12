import React, { CSSProperties } from 'react';
import { View } from './view';
import { Subscription } from 'rxjs';

export default class Home extends View {

    subscription?:Subscription;
    iframe:any;

    componentWillMount() {
        this.iframe = React.createRef();
        if (!this.mainCtrl.isInitialized()) {
            if(this.props.history) this.props.history.push('/');
            return;
        }
        window.addEventListener('message', (e:any)=> {
            const evt = new KeyboardEvent('keydown', {key:e.data});
            document.dispatchEvent(evt);
        })
    }

    componentDidMount() {
        this.subscription = this.mainCtrl.home$.subscribe(()=> {
            const data = this.mainCtrl.getRenderData();
            if (this.iframe.current)
                this.iframe.current.contentWindow.postMessage({
                    code: data.code,
                    state: data.state,
                    imp: Object.keys(data.imp),
                    platform: this.mainCtrl.getPlatform()
                }, '*');
        });
    }

    componentWillUnmount() {
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    render() {
        if (!this.mainCtrl.isInitialized()) {
            return <div></div>
        }
        return <iframe title="view" style={styles.iframe} src="/frame" ref={this.iframe}></iframe>
    }
}

const styles:{[s: string]: CSSProperties;} = {
    iframe: {
        width:'100%',
        height:'100%',
        position: 'absolute',
        borderWidth: 0,
    }
}