import React from 'react';
import { Input, Label } from 'reactstrap'
import Layout from './layout'
import Utils from '../../service/utils';
import { LayoutManager } from './../../manager/layout.manager';
import AceEditor from 'react-ace';
import 'brace/theme/github';
import 'brace/mode/css';
import 'brace/ext/language_tools';

export default class SidebarProperty extends React.Component {

    layoutManager
    state = {
        value: 'style {\n\n}',
        selectedItem: {}
    }

    componentWillMount() {
        this.layoutManager = LayoutManager.getInstance(LayoutManager);
    }

    componentWillReceiveProps(nextProps) {
        let selectedItem;
        Utils.loop(nextProps.layout, item=> {
            if (nextProps.selected === item.id) {
                selectedItem = item;
            }
        });
        if (this.state.selectedItem !== selectedItem) {
            this.setState({
                value: selectedItem.style,
                selectedItem: selectedItem
            });
        }
    }
    
    render() {
        return <div>
            <Layout layout={this.props.layout} selected={this.props.selected} tab={'property'}/>
            <h5>Style</h5>
            <AceEditor
                style={{width:'100%', height:200}}
                theme="github" 
                mode="css" 
                value={this.state.value}
                onChange={(value)=> this.setState({value:value})}
                onValidate={(value)=> {
                    let error = false;
                    value.forEach(item=> {
                        if (item.type === 'error') error = true;
                    });
                    if (!error) this.layoutManager.update({id:this.state.selectedItem.id, style:this.state.value})
                }}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                editorProps={{$blockScrolling: Infinity }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2
                }}
                />
            
            <h5>Property</h5>
            {
                this.state.selectedItem.property && Object.keys(this.state.selectedItem.property).map(key=> {
                    return <div key={key}>
                        <Label style={styles.propLabel}>{key}</Label>
                        <Input style={styles.propValue} value={this.state.selectedItem.property[key]} onChange={(e)=>{
                            const prop = Utils.deepcopy(this.state.selectedItem.property);
                            prop[key] = e.target.value;
                            this.layoutManager.update({id:this.state.selectedItem.id, property:prop});
                        }}/>
                    </div>
                })
            }
        </div>
    }
}

const styles = {
    propLabel: {
        display:'inline-block',
        width:'30%'
    },
    propValue: {
        display: 'inline-block',
        width:'70%'
    }
}