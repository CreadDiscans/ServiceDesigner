import React, { CSSProperties } from 'react';
import { Platform } from '../utils/constant';
import CodeSandbox from 'react-code-sandbox';
import { Library } from '../models/library';
import { fromEvent } from 'rxjs';

export class FrameView extends React.Component {

  state:any = {
    hasError: false,
    data:{}
  }
  
  componentDidMount() {
    window.addEventListener('message', this.handleIframeTask);
    fromEvent<KeyboardEvent>(document, 'keydown').subscribe((e:KeyboardEvent)=> {
      window.parent.postMessage(e.key, '*');
    })
  }

  handleIframeTask = (e:any) => {
    this.setState({
      data:e.data,
      hasError:false
    });
  }

  componentDidCatch() {
    this.setState({hasError:true});
  }

  render() {
    return <div id="design">
        { this.state.data.platform === Platform.ReactNative && <img style={{height:'100vh'}} src="/frame.jpg" /> }
        <div style={(this.state.data.platform === Platform.ReactNative) ? styles.mobile : {}}>
            {this.sandbox()}
        </div>
    </div>
  }
  
  sandbox() {
    if (!this.state.data.platform) {
      return <div></div>
    } else if (this.state.hasError) {
        return <div>Syntax Error</div>
    } else {
        const imp:any = {React}
        this.state.data.imp.forEach((name:string)=> {
          if(Library[name])
            imp[name] = Library[name].lib
        });
        return <CodeSandbox imports={imp}>
        {'state='+JSON.stringify(this.state.data.state)+';renderPart=(name)=>{};onEvent=(e)=>{};render(' +this.state.data.code + ')'}
        </CodeSandbox>
    }
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