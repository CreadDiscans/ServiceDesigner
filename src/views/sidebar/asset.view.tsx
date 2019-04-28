import React from 'react';
import { Input, Button, Tooltip } from 'reactstrap';
import { View } from './../view';
import { ResourceType, Resource } from '../../models/resource';
import { Action } from '../../utils/constant';
declare var window:any;

export class SidebarAsset extends View {

    state = {
        name: '',
        open: '',
    }

    fileRef:any;

    constructor(props:any) {
        super(props);
        this.fileRef = React.createRef();
    }

    fileSelect = (e:any) => {
        console.log(e, e.target, e.target.files);
        const FileReader = new window.FileReader();
        FileReader.onload = (e:any) => {
            const name = this.state.name;
            const resource = this.mainCtrl.getResource(ResourceType.ASSET, name);
            if (resource && !Array.isArray(resource)) {
                resource.value = e.target.result;
                this.mainCtrl.resourceControl(Action.Update, resource);
            } else if (resource === undefined) {
                let rsc = new Resource(name, ResourceType.ASSET, e.target.result);
                this.mainCtrl.resourceControl(Action.Create, rsc);
            }
            this.setState({name:''});
        }
        FileReader.readAsDataURL(e.target.files[0]);
    }

    add = () => {
        if(this.state.name && this.state.name !== '') {
            this.fileRef.current.click();
        }
    }

    delete = () => {
        const name = this.state.name;
        const resource = this.mainCtrl.getResource(ResourceType.ASSET, name);
        if (resource && !Array.isArray(resource)) {
            this.mainCtrl.resourceControl(Action.Delete, resource);
            this.setState({name:''});
        }
    }

    toogle = (asset:Resource) => {
        if (this.state.open === asset.name) {
            this.setState({open:''});
        } else {
            this.setState({open:asset.name});
        }
    }

    render() {
        const resource = this.mainCtrl.getResource(ResourceType.ASSET);
        return <div>
            <h5>Asset</h5>
            {Array.isArray(resource) && resource.map((asset:Resource, i:number)=> {
                return <div key={i} style={{margin:10}}>
                {asset.name} 
                <img 
                    id={'asset-'+asset.name}
                    style={{width:30, height:30, float:'right'}} 
                    src={asset.value} alt=""/>
                <Tooltip placement="right" target={'asset-'+asset.name} isOpen={this.state.open === asset.name} toggle={()=>this.toogle(asset)}>
                    <img style={{width:150}} src={asset.value} alt=""/>
                </Tooltip>
            </div>
            })}
            <Input placeholder="name" value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})}/>
            <input type="file" style={{display:'none'}} ref={this.fileRef} onChange={this.fileSelect}/>
            <Button 
                color="success" 
                style={{display:'inline-block', width:'50%'}}
                onClick={this.add}>Add</Button>
            <Button 
                color="danger" 
                style={{display:'inline-block', width:'50%'}}
                onClick={this.delete}>Delete</Button>
        </div>
    }
}