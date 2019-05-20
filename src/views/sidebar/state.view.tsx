import React from 'react';
import { View } from '../view';
import AceEditor from 'react-ace';
import 'brace/theme/github';
import 'brace/mode/json';
import { Action } from '../../utils/constant';
import Utils from './../../utils/utils';
import { File } from '../../models/file';

export class SidebarState extends View {

    state = {
        value: '{}'
    }

    componentWillMount() {
        const file = this.mainCtrl.getSelectedFile();
        this.setState({value: JSON.stringify(file.state, null, 2)})
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize = () => {
        this.setState({});
    }

    render() {
        const file = this.mainCtrl.getSelectedFile();
        return <div>
            <h5>State</h5>
            <div>- {file.name}</div>
            <AceEditor
                style={{width:'100%', height:window.innerHeight - 66}}
                theme="github" 
                mode="json" 
                value={this.state.value}
                onChange={(value)=> {
                    this.setState({value:value})
                }}
                onValidate={(value)=> {
                    let error = false;
                    value.forEach(item=> {
                        if (item.type === 'error') error = true;
                    });
                    if (!error) {
                        const file = this.mainCtrl.getSelectedFile();
                        const root = this.mainCtrl.getFolderData()
                        let parent;
                        Utils.loop(root, (item:File)=> {
                            item.children.forEach((child:File)=> {
                                if (child.id === file.id) {
                                    parent = item;
                                }
                            })
                        })
                        const newOne = file.clone()
                        try {
                            newOne.state = JSON.parse(this.state.value);
                            this.mainCtrl.fileControl(Action.Update, parent, file.clone(), newOne);
                        } catch(e) {}
                    }
                }}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                editorProps={{$blockScrolling: Infinity }}
                setOptions={{
                    showLineNumbers: true,
                    tabSize: 2
                }}
                />
        </div>
    }
}