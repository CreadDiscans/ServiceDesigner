import React from 'react';
import { SketchPicker } from 'react-color';

export class SidebarColor extends React.Component{
    render() {
        return <div>
            <h5>Color</h5>
            <SketchPicker />
        </div>

    }
}