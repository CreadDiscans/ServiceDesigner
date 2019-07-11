import React from 'react';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as resourceActions from './Resource.actions';
import { Theme } from '../utils/Theme';
import AceEditor from 'react-ace';

class StyleView extends React.Component<any> {

    state = {
        hover:undefined,
        select: false,
        name: '',
        value:'',
    }

    render() {
        const { data, ResourceActions } = this.props;
        return <div>
            <div id="style-item-wrap" style={styles.styles}>
                {data.resource.style.map(style=> <div className="style-item" key={style.name}
                    style={Object.assign({}, styles.styleItem, 
                        this.state.hover === 'item-'+style.name && {backgroundColor:Theme.bgBodyHoverColor}, 
                        this.state.select && this.state.name === style.name && {backgroundColor: Theme.bgHeadActiveColor, color:Theme.fontActiveColor})}
                    onMouseEnter={()=> this.setState({hover: 'item-'+style.name})}
                    onMouseLeave={()=> this.setState({hover: undefined})}
                    onClick={()=> this.setState({name: style.name, value: style.value, select:true})}>
                    {style.name}
                </div>)}
            </div>
            <div style={styles.pallete}>
                <div>
                    {this.state.select === false ? 
                    <button id="css-button-add-style" 
                        style={Object.assign({}, styles.btn, this.state.hover === 'style' && styles.btnHover)}
                        onMouseEnter={()=>this.setState({hover:'style'})}
                        onMouseLeave={()=>this.setState({hover:undefined})}
                        onClick={()=> {
                            if (this.state.name !== '') {
                                ResourceActions.createStyle({
                                    name: this.state.name,
                                    value: this.state.value
                                })
                                this.setState({
                                    name: '',
                                    value: '',
                                    select: false
                                })
                            }
                        }}>Add</button>
                     : [
                        <button id="style-button-update" 
                            style={Object.assign({}, styles.btn, this.state.hover === 'update' && styles.btnHover)} key={0}
                            onMouseEnter={()=>this.setState({hover:'update'})}
                            onMouseLeave={()=>this.setState({hover:undefined})}
                            onClick={()=> 
                                ResourceActions.updateStyle({
                                    name: this.state.name, 
                                    value: this.state.value,
                                })
                            }>Update</button>,
                        <button id="style-button-delete" 
                            style={Object.assign({}, styles.btn, this.state.hover === 'delete' && styles.btnHover)} key={1}
                            onMouseEnter={()=>this.setState({hover:'delete'})}
                            onMouseLeave={()=>this.setState({hover:undefined})}
                            onClick={()=> {
                                ResourceActions.deleteStyle(this.state.name);
                                this.setState({
                                    name: '',
                                    value: '',
                                    select: false})
                            }}>Delete</button>,
                        <button id="style-button-cancel" 
                            style={Object.assign({}, styles.btn, this.state.hover === 'cancel' && styles.btnHover)} key={2}
                            onMouseEnter={()=>this.setState({hover:'cancel'})}
                            onMouseLeave={()=>this.setState({hover:undefined})}
                            onClick={()=> this.setState({
                                name: '',
                                value: '',
                                select: false
                            })}>Cancel</button>,
                    ]}
                </div>
                <div id="style-editor">
                    <input id="style-input-name" 
                        style={styles.itemInput} 
                        value={this.state.name} 
                        onChange={(e)=>this.setState({name: e.target.value})} 
                        placeholder="Name" 
                        disabled={this.state.select}/>
                    <AceEditor
                        style={{width:'100%', height: 300}}
                        theme="tomorrow_night" 
                        mode={'css'}
                        value={this.state.value}
                        onChange={(value)=> this.setState({value: value})}
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
                        }}
                    />
                </div>
            </div>
        </div>
    }
}

const styles = {
    layout: {
        padding:10,
        height:'100%'
    },
    styles: {
        display:'inline-block',
        width:'50%',
        padding:5,
        verticalAlign:'top'
    },
    pallete: {
        display:'inline-block',
        width:'50%',
        padding:5
    }, 
    btn: {
        color:Theme.fontColor,
        backgroundColor: Theme.bgHeadColor,
        cursor:'pointer',
        borderWidth:0,
        padding:'5px 8px',
        fontSize:14,
        borderRadius: 6,
        margin:5
    },
    btnHover: {
        backgroundColor:Theme.bgBodyHoverColor
    },
    itemInput: {
        fontSize:12,
        color:Theme.fontColor,
        backgroundColor:Theme.bgBodyActiveColor,
        borderWidth:0,
        outline:'none',
        width:'100%'
    },
    styleItem: {
        fontSize:12,
        color:Theme.fontColor,
        padding:5,
        width:'100%',
        cursor:'pointer'
    }
}

export default connectRouter(
    (state)=> ({
        data: {
            resource: state.resource
        }
    }),
    (dispatch)=> ({
        ResourceActions: bindActionCreators(resourceActions, dispatch)
    }),
    StyleView
)