import React from 'react';
import AceEditor from 'react-ace';
import 'brace/theme/github';
import 'brace/mode/css';
import 'brace/ext/language_tools';
import { Button } from 'reactstrap';
import { View } from '../view';
import { ResourceType, Resource } from '../../models/resource';
import { Action } from '../../utils/constant';


export class SidebarCss extends View {

    state = {
        value: ''
    }

    addCss = () => {
        const name = this.state.value.split('{')[0].slice(1).replace(/^\s+|\s+$/g, '');
        const resource = this.mainCtrl.getResource(ResourceType.CSS, name);
        if (resource && !Array.isArray(resource)) {
            resource.value = this.state.value;
            this.mainCtrl.resourceControl(Action.Update, resource)
        } else if (resource === undefined) {
            let rsc = new Resource(name, ResourceType.CSS, this.state.value);
            this.mainCtrl.resourceControl(Action.Create, rsc)
        }
    }

    deleteCss = () => {
        const name = this.state.value.split('{')[0].slice(1).replace(/^\s+|\s+$/g, '');
        const resource = this.mainCtrl.getResource(ResourceType.CSS, name);
        if (resource && !Array.isArray(resource))
            this.mainCtrl.resourceControl(Action.Delete, resource);
    }

    render() {
        const resource = this.mainCtrl.getResource(ResourceType.CSS);
        return <div>
            <h5>Css</h5>
            <AceEditor
                style={{width:'100%', height:300}}
                theme="github" 
                mode="css" 
                value={this.state.value}
                onChange={(value)=> this.setState({value:value})}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                editorProps={{$blockScrolling: Infinity }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2
                }}/>
                { Array.isArray(resource) && resource.map((item:Resource, i:number)=> {
                    return <div key={i} style={{cursor:'pointer'}} onClick={()=> {
                        this.setState({value: item.value})
                    }}>{item.name}</div>
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