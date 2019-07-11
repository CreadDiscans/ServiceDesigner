import React from 'react';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as resourceActions from './Resource.actions';
import { Theme } from '../utils/Theme';
declare var window:any;

class AssetView extends React.Component<any> {

    state = {
        hover:undefined,
        name:undefined,
        newName: '',
        value: undefined,
    }

    fileSelect = (e:any) => {
        const FileReader = new window.FileReader();
        FileReader.onload = (e:any) => {
            const { ResourceActions } = this.props;
            ResourceActions.createAsset({name:this.state.newName, value: e.target.result});
            this.setState({newName: '', name: this.state.newName, value: e.target.result});
        }
        FileReader.readAsDataURL(e.target.files[0]);
    }

    render() {
        const { data, ResourceActions } = this.props;
        return <div>
            <div id="asset-item-wrap" style={styles.colors}>
                {data.resource.asset.map(asset=> <div className="asset-item" key={asset.name}
                    style={Object.assign({}, styles.assetItem, 
                        this.state.hover === 'item-'+asset.name && {backgroundColor:Theme.bgBodyHoverColor}, 
                        this.state.name === asset.name && {backgroundColor: Theme.bgHeadActiveColor, color:Theme.fontActiveColor})}
                    onMouseEnter={()=> this.setState({hover: 'item-'+asset.name})}
                    onMouseLeave={()=> this.setState({hover: undefined})}
                    onClick={()=> this.setState({name: asset.name, value: asset.value})}>
                    {asset.name}
                    <img 
                        id={'asset-'+asset.name}
                        style={{width:25, height:25, margin:-3, float:'right'}} 
                        src={asset.value} alt=""/>
                </div>)}
            </div>
            <div style={styles.pallete}>
                { this.state.name !== undefined ? [
                    <img key={0} style={{maxWidth:'100%'}} src={this.state.value} alt=""/>,
                    <button id="asset-delete" key={1}
                        style={Object.assign({},styles.btn, this.state.hover === 'delete' && {backgroundColor:Theme.bgBodyHoverColor})} 
                        onMouseEnter={()=>this.setState({hover:'delete'})}
                        onMouseLeave={()=>this.setState({hover:undefined})}
                        onClick={()=> {
                            ResourceActions.deleteAsset(this.state.name);
                            this.setState({name: undefined});
                        }}>Delete</button>,
                    <button id="asset-cancel" key={2}
                        style={Object.assign({},styles.btn, this.state.hover === 'cancel' && {backgroundColor:Theme.bgBodyHoverColor})} 
                        onMouseEnter={()=>this.setState({hover:'cancel'})}
                        onMouseLeave={()=>this.setState({hover:undefined})}
                        onClick={()=> {
                            this.setState({name: undefined, value:undefined});
                        }}>Cancel</button>] :[
                    <div key={0} style={{width:160, display:'inline-block'}}>
                        <input id="asset-input" style={styles.itemInput} value={this.state.newName} onChange={(e)=>this.setState({newName: e.target.value})}/>
                    </div>,
                    <button id="asset-create" key={1}
                        style={Object.assign({},styles.btn, this.state.hover === 'create' && {backgroundColor:Theme.bgBodyHoverColor})} 
                        onMouseEnter={()=>this.setState({hover:'create'})}
                        onMouseLeave={()=>this.setState({hover:undefined})}
                        onClick={()=> {
                            if (this.state.newName !== '') {
                                const file:any = this.refs.file;
                                file.click()
                            }
                        }}>Create</button>
                ] }
                <input id="asset-file-input" type="file" style={{display:'none'}} ref={'file'} onChange={this.fileSelect}/>
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
    assetItem: {
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
    AssetView
)