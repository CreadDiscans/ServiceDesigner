import React from 'react';
import { 
    FaBars,
    FaFolder,
    FaCode,
    FaCog
 } from 'react-icons/fa'
import SidebarFolder from './folder';
import SidebarCode from './code';
import SidebarProperty from './property';

export default class Sidebar extends React.Component {

    state = {
        collapse: false,
        page: 'folder'
    }

    icon(iconTag) {
        iconTag = React.cloneElement(iconTag, {style:styles.baricon})
        return <div styles={styles.baricon}>
            {iconTag}
        </div>
    }

    render() {
        return (
            <div>
                <div style={styles.sidebar}>
                    {this.icon(<FaBars onClick={()=>this.setState({collapse: !this.state.collapse})} />)}
                    {this.icon(<FaFolder onClick={()=>this.setState({collapse: true, page:'folder'}) } />)}
                    {this.icon(<FaCode onClick={()=>this.setState({collapse: true, page:'code'}) } />)}
                    {this.icon(<FaCog onClick={()=>this.setState({collapse: true, page:'property'})} />)}

                </div>
                <div style={{...styles.collapseSidebar, ...{
                    left: this.state.collapse ? 40 : -160
                }}}>
                    {this.state.page === 'folder' && <SidebarFolder />}
                    {this.state.page === 'code' && <SidebarCode />}
                    {this.state.page === 'property' && <SidebarProperty />}
                </div>
                <div style={styles.body} onClick={()=>{this.setState({collapse: false})}}>
                    {this.props.children}
                </div>
            </div>
        );
    }
};

const styles = {
    sidebar: {
        position:'absolute',
        width:40,
        top:0,
        left:0,
        bottom:0,
        backgroundColor:'#EEE',
        textAlign: 'center',
        zIndex:10
    },
    collapseSidebar: {
        transition: '0.5s',
        position:'absolute',
        width: 200,
        top:0,
        left:40,
        bottom:0,
        backgroundColor:'#EEE',
        zIndex:5,
        overflow:'auto'
    },
    baricon: {
        cursor:'pointer'
    },
    body: {
        top:0,
        bottom:0,
        left:40,
        right:0,
        position: 'absolute',
        overflow:'auto'
    }
}