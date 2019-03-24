import React from 'react';
import AceEditor from 'react-ace';
import 'brace/theme/github';
import 'brace/mode/css';
import { Button } from 'reactstrap';
import { CssManager } from './../../manager/css.manager';


export class SidebarCss extends React.Component {

    state = {
        value: ''
    }

    cssManager;

    componentWillMount() {
        this.cssManager = CssManager.getInstance(CssManager);
    }

    addCss = () => {
        const name = this.state.value.split('{')[0].slice(1).replace(/^\s+|\s+$/g, '');
        if (name in this.cssManager.data) {
            this.cssManager.update(name, this.state.value);
        } else {
            this.cssManager.create(name, this.state.value);
        }
    }

    deleteCss = () => {
        const name = this.state.value.split('{')[0].slice(1).replace(/^\s+|\s+$/g, '');
        if (name in this.cssManager.data) {
            this.cssManager.delete(name);
        }
    }

    render() {
        return <div>
            <h5>Css</h5>
            <AceEditor
                style={{width:'100%', height:300}}
                theme="github" 
                mode="css" 
                value={this.state.value}
                onChange={(value)=> this.setState({value:value})}
                editorProps={{
                $blockScrolling: false,
                }} />
            {Object.keys(this.cssManager.data).map(item=> {
                return <div key={item} style={{cursor:'pointer'}} onClick={()=> {
                    this.setState({value: this.cssManager.data[item]})
                }}>{item}</div>
            })}
            <div>
                <Button 
                    color="success" 
                    style={{dispaly:'inline-block', width:'50%'}} 
                    onClick={this.addCss}>Add</Button>
                <Button 
                    color="danger"
                    style={{display:'inline-block', width:'50%'}}
                    onClick={this.deleteCss}>Delete</Button>
            </div>
        </div>
    }
}