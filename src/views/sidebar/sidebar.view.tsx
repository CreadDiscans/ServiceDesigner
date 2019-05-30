import React, { CSSProperties } from 'react';
import { 
    FaFolder,
    FaCode,
    FaCog,
    FaFileImport,
    FaSave,
    FaUndo,
    FaRedo,
    FaQuestion,
    FaReact,
    FaPalette,
    FaImages,
    FaCss3,
    FaFileExport
 } from 'react-icons/fa'
import { SidebarFolder } from './folder.view';
import { SidebarElement } from './element.view';
import { SidebarStyle } from './style.view';
import { SidebarHelp } from './help.view';
import { SidebarState } from './state.view';
import { SidebarColor } from './color.view';
import { SidebarAsset } from './asset.view';
import { SidebarCss } from './css.view';
import { SideTab } from '../../utils/constant';
import { View } from '../view';
import { PropertyView } from './property.view';

export default class Sidebar extends View {

    state = {
        sidebarWidth: 220
    }

    componentDidMount() {
        this.mainCtrl.sidebar$.subscribe(()=> this.setState({}));
    }

    icon(iconTag:JSX.Element, name:string):JSX.Element {
        iconTag = React.cloneElement(iconTag, {style:styles.baricon})
        return <div id={name} style={styles.baricon}>
            {iconTag}
        </div>
    }

    render() {
        const tab = this.mainCtrl.getTab();
        return (
            <div style={{borderTop:'solid 1px #CCC'}}>
                <div style={styles.sidebar}>
                    {this.icon(<FaQuestion onClick={()=>this.mainCtrl.setTab(SideTab.Help)}/>, SideTab.Help.toString())}
                    {this.icon(<FaFolder onClick={()=>this.mainCtrl.setTab(SideTab.Folder)} />, SideTab.Folder.toString())}
                    {this.icon(<FaReact onClick={()=>this.mainCtrl.setTab(SideTab.State)} />, SideTab.State.toString())}
                    {this.icon(<FaCode onClick={()=>this.mainCtrl.setTab(SideTab.Element)} />, SideTab.Element.toString())}
                    {/* {this.icon(<FaCog onClick={()=>this.mainCtrl.setTab(SideTab.Style)} />, SideTab.Style.toString())} */}
                    {this.icon(<FaCss3 onClick={()=>this.mainCtrl.setTab(SideTab.Css)} />, SideTab.Css.toString())}
                    {this.icon(<FaPalette onClick={()=>this.mainCtrl.setTab(SideTab.Color)} />, SideTab.Color.toString())}
                    {this.icon(<FaImages onClick={()=>this.mainCtrl.setTab(SideTab.Asset)} />, SideTab.Asset.toString())}
                    {this.icon(<FaSave onClick={()=>this.mainCtrl.export(true)}/>, 'save')}
                    {this.icon(<FaFileExport onClick={()=>this.mainCtrl.export()} />, 'export')}
                    {this.icon(<FaFileImport onClick={()=>this.mainCtrl.import()}/>, 'import')}
                    {/* {this.icon(<FaUndo onClick={()=>this.mainCtrl.undo()} />, 'undo')}
                    {this.icon(<FaRedo onClick={()=>this.mainCtrl.redo()} />, 'redo')} */}

                </div>
                {this.mainCtrl.isInitialized() ? <div id="sidebar" 
                    style={{...styles.collapseSidebar, ...{width:this.state.sidebarWidth}}}>
                    <div draggable={true} style={styles.sidebarBorder} onDrag={e=> {
                        this.setState({sidebarWidth: e.screenX - 40});
                    }}></div>
                    {tab === SideTab.Help && <SidebarHelp />}
                    {tab === SideTab.Folder && <SidebarFolder />}
                    {tab === SideTab.State && <SidebarState />}
                    {tab === SideTab.Element && <SidebarElement />}
                    {/* {tab === SideTab.Style && <SidebarStyle />} */}
                    {tab === SideTab.Css && <SidebarCss />}
                    {tab === SideTab.Color && <SidebarColor />}
                    {tab === SideTab.Asset && <SidebarAsset />}
                </div>: <div draggable={false}
                    style={{...styles.collapseSidebar, ...{width:this.state.sidebarWidth}}}>
                    <div draggable={true} style={styles.sidebarBorder} onDrag={e=> {
                        this.setState({sidebarWidth: e.screenX - 40});
                    }}></div>
                    <SidebarHelp />
                </div>}
                { this.mainCtrl.getSelectedElement() && (
                    <div>
                        <PropertyView />
                        <SidebarStyle />
                    </div>
                )}
                <div style={styles.body}>
                    {this.props.children}
                </div>
            </div>
        );
    }
};

const styles:{[s: string]: CSSProperties;} = {
    sidebar: {
        position:'absolute',
        width:40,
        top:0,
        left:0,
        bottom:0,
        backgroundColor:'#EEE',
        textAlign: 'center',
        borderTop:'solid 1px #CCC',
        borderRight:'solid 1px #E0E0E0',
        zIndex:10
    },
    collapseSidebar: {
        transition: '0.5s',
        position:'absolute',
        top:0,
        left:40,
        bottom:0,
        backgroundColor:'#EEE',
        borderTop:'solid 1px #CCC',
        zIndex:5,
        overflow:'auto',
        paddingRight:10
    },
    sidebarBorder: {
        right:0,
        top:0,
        bottom:0,
        width:1,
        background: '#CCC',
        position:'absolute',
        cursor:'w-resize'
    },
    baricon: {
        cursor:'pointer'
    },
    body: {
        top:0,
        bottom:0,
        left:260,
        right:200,
        position: 'absolute',
        overflow:'auto'
    }
}