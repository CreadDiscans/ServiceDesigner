import React from 'react';
import { Input, Label } from 'reactstrap'
import Layout from './layout'
import Utils from '../../service/utils';
import { LayoutManager } from './../../manager/layout.manager';
import AceEditor from 'react-ace';
import 'brace/theme/github';
import 'brace/mode/css';

export default class SidebarProperty extends React.Component {

    layoutManager
    state = {
        value: 'style {\n\n}',
        selectedItem: undefined
    }

    componentWillMount() {
        this.layoutManager = LayoutManager.getInstance(LayoutManager);

    }
    
    render() {
        let selectedItem;
        Utils.loop(this.props.layout, item=> {
            if (this.props.selected === item.id) {
                selectedItem = item;
            }
        });
        if (this.state.selectedItem !== selectedItem) {
            this.setState({
                value: selectedItem.style,
                selectedItem: selectedItem
            });
        }
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
                    if (!error) this.layoutManager.update({id:selectedItem.id, style:this.state.value})
                }}
                editorProps={{
                $blockScrolling: false,
                }} />
            
            <h5>Property</h5>
            {
                Object.keys(selectedItem.property).map(key=> {
                    return <div key={key}>
                        <Label style={styles.propLabel}>{key}</Label>
                        <Input style={styles.propValue} value={selectedItem.property[key]} onChange={(e)=>{
                            const prop = Utils.deepcopy(selectedItem.property);
                            prop[key] = e.target.value;
                            this.layoutManager.update({id:selectedItem.id, property:prop});
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