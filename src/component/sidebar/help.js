import React from 'react';
import { FaQuestion, FaSave, FaFileImport, FaFolder, FaCode, FaCog, FaUndo, FaRedo, FaReact } from 'react-icons/fa';

export class SidebarHelp extends React.Component {

    icon(children, desc) {
        return <div style={{padding:5}}>
            {children} {desc}
        </div>
    }

    render() {
        return <div>
            <h3>Help</h3>
            
            {this.icon(<FaQuestion  />, 'Help')}
            {this.icon(<FaSave />, 'Export')}
            {this.icon(<FaFileImport />, 'Import')}
            {this.icon(<FaFolder  />, 'Folder')}
            {this.icon(<FaReact />, 'State')}
            {this.icon(<FaCode />, 'Element')}
            {this.icon(<FaCog  />, 'Property / Style')}
            {this.icon(<FaUndo />, 'Undo')}
            {this.icon(<FaRedo />, 'Redo')}
        </div>
    }
}