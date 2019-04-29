import React from 'react';
import { SketchPicker } from 'react-color';
import { Input, Button } from 'reactstrap';
import { View } from '../view';
import { ResourceType, Resource } from '../../models/resource';
import { Action } from '../../utils/constant';

export class SidebarColor extends View {

    state = {
        color:'#fff',
        name: '',
    }

    handleChange = (e:any) => {
        this.setState({color:e.hex});
    }

    addColor = () => {
        const name = this.state.name;
        const resource = this.mainCtrl.getResource(ResourceType.COLOR, name);
        if (resource && !Array.isArray(resource)) {
            const newOne = resource.clone();
            newOne.value = this.state.color;
            this.mainCtrl.resourceControl(Action.Update, resource.clone(), newOne);
        } else if (resource === undefined) {
            let rsc = new Resource(name, ResourceType.COLOR, this.state.color);
            this.mainCtrl.resourceControl(Action.Create, undefined, rsc);
        }
    }

    deleteColor = () => {
        const name = this.state.name;
        const resource = this.mainCtrl.getResource(ResourceType.COLOR, name);
        if (resource && !Array.isArray(resource))
            this.mainCtrl.resourceControl(Action.Delete, resource.clone(), undefined);
    }

    render() {
        const resource = this.mainCtrl.getResource(ResourceType.COLOR);
        return <div>
            <h5>Color</h5>
            <SketchPicker color={this.state.color} onChangeComplete={this.handleChange}/>
            { Array.isArray(resource) && resource.map((color:Resource, i:number)=> {
                return <div key={i}>
                    <div style={{width:10, height:10, 
                        display: 'inline-block',
                        marginLeft: 5,
                        marginRight:5,
                        background:color.value}} />{color.name} 
                </div>
            })}
            <div>
                <Input style={{width:'100%'}} 
                    value={this.state.name} 
                    onChange={(e)=>this.setState({name:e.target.value})}
                    placeholder="name"/>
                <Button 
                    color="success" 
                    style={{dispaly:'inline-block', width:'50%'}} 
                    onClick={this.addColor}>Add</Button>
                <Button 
                    color="danger"
                    style={{display:'inline-block', width:'50%'}}
                    onClick={this.deleteColor}>Delete</Button>
            </div>
        </div>

    }
}