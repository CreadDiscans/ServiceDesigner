import React from 'react';
import { connectRouter } from '../redux/connection';
import { SketchPicker } from 'react-color';
import { Theme } from '../utils/Theme';
import { bindActionCreators } from 'redux';
import * as resourceActions from './Resource.actions';

class ColorView extends React.Component<any> {

    state = {
        hover: undefined,
        name: undefined,
        newName: '',
        color: ''
    }

    render() {
        const { data, ResourceActions } = this.props;
        return <div style={styles.layout}>
            <div id="color-item-wrap" style={styles.colors}>
                {data.resource.color.map(color=> <div className="color-item" key={color.name}
                    style={Object.assign({}, styles.colorItem, 
                        this.state.hover === 'item-'+color.name && {backgroundColor:Theme.bgBodyHoverColor}, 
                        this.state.name === color.name && {backgroundColor: Theme.bgHeadActiveColor, color:Theme.fontActiveColor})}
                    onMouseEnter={()=> this.setState({hover: 'item-'+color.name})}
                    onMouseLeave={()=> this.setState({hover: undefined})}
                    onClick={()=> this.setState({name: color.name, color: color.value})}>
                    {color.name}
                    <div style={{width:15, height:15, marginTop:1, display:'inline-block', backgroundColor: color.value, float:'right'}} />
                    <span style={{float:'right', marginRight:5}}>{color.value}</span>
                </div>)}
            </div>
            <div style={styles.pallete}>
                <SketchPicker color={this.state.color} onChangeComplete={(e)=> this.setState({color:e.hex})}/>
                { this.state.name !== undefined ? [
                    <button id="color-update" key={0}
                        style={Object.assign({},styles.btn, this.state.hover === 'update' && {backgroundColor:Theme.bgBodyHoverColor})} 
                        onMouseEnter={()=>this.setState({hover:'update'})}
                        onMouseLeave={()=>this.setState({hover:undefined})}
                        onClick={()=>{
                            ResourceActions.updateColor({name:this.state.name, value: this.state.color});
                        }}>Update</button>, 
                    <button id="color-delete" key={1}
                        style={Object.assign({},styles.btn, this.state.hover === 'delete' && {backgroundColor:Theme.bgBodyHoverColor})} 
                        onMouseEnter={()=>this.setState({hover:'delete'})}
                        onMouseLeave={()=>this.setState({hover:undefined})}
                        onClick={()=> {
                            ResourceActions.deleteColor(this.state.name);
                            this.setState({name: undefined});
                        }}>Delete</button>,
                    <button id="color-cancel" key={2}
                        style={Object.assign({},styles.btn, this.state.hover === 'cancel' && {backgroundColor:Theme.bgBodyHoverColor})} 
                        onMouseEnter={()=>this.setState({hover:'cancel'})}
                        onMouseLeave={()=>this.setState({hover:undefined})}
                        onClick={()=> {
                            this.setState({name: undefined});
                        }}>Cancel</button>] :[
                    <div key={0} style={{width:160, display:'inline-block'}}>
                        <input id="color-input" style={styles.itemInput} value={this.state.newName} onChange={(e)=>this.setState({newName: e.target.value})}/>
                    </div>,
                    <button id="color-create" key={1}
                        style={Object.assign({},styles.btn, this.state.hover === 'create' && {backgroundColor:Theme.bgBodyHoverColor})} 
                        onMouseEnter={()=>this.setState({hover:'create'})}
                        onMouseLeave={()=>this.setState({hover:undefined})}
                        onClick={()=> {
                            if (this.state.newName !== '') {
                                ResourceActions.createColor({name: this.state.newName, value: this.state.color});
                                this.setState({newName: ''});
                            }
                        }}>Create</button>
                ] }
            </div>
        </div>
    }
}

const styles = {
    layout: {
        padding:10,
        height:'100%'
    },
    colors: {
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
    itemInput: {
        fontSize:12,
        color:Theme.fontColor,
        backgroundColor:Theme.bgBodyActiveColor,
        borderWidth:0,
        outline:'none',
        width:'100%'
    },
    colorItem: {
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
    ColorView
)