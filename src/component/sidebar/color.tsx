import React from 'react';
import { SketchPicker } from 'react-color';
import { ColorManager } from '../../manager/color.manager';
import { Input, Button } from 'reactstrap';

export class SidebarColor extends React.Component{

    state = {
        color:'#fff',
        name: '',
        selected: null
    }

    colorManager:ColorManager;

    constructor(props:any) {
        super(props);
        this.colorManager = ColorManager.getInstance(ColorManager);
    }

    handleChange = (e:any) => {
        this.setState({color:e.hex});
    }

    addColor = (e:any) => {
        if (this.state.name && this.state.name !== '') {
            if (this.state.name in this.colorManager.data) {
                this.colorManager.update(this.state.name, this.state.color);
            } else {
                this.colorManager.create(this.state.name, this.state.color);
            }
            this.setState({name:''});
        }
    }

    deleteColor = (e:any) => {
        if (this.state.name in this.colorManager.data) {
            this.colorManager.delete(this.state.name);
            this.setState({name:''});
        }
    }

    render() {
        return <div>
            <h5>Color</h5>
            <SketchPicker color={this.state.color} onChangeComplete={this.handleChange}/>
            {Object.keys(this.colorManager.data).sort().map(color=> {
                return <div key={color}>
                    <div style={{width:10, height:10, 
                        display: 'inline-block',
                        marginLeft: 5,
                        marginRight:5,
                        background:this.colorManager.data[color]}} />{color} 
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