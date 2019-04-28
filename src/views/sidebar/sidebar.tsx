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
import SidebarFolder from './folder';
import SidebarCode from './code';
import SidebarProperty from './property';
import PubsubService from '../../service/pubsub.service';
import { FolderManager } from '../../manager/folder.manager';
import { LayoutManager } from '../../manager/layout.manager';
import { ElementManager } from '../../manager/element.manager';
import { DataManager } from '../../manager/data.manager';
import { HistoryService } from '../../service/history.service';
import { SidebarHelp } from './help';
import { SidebarState } from './state';
import { SidebarColor } from './color';
import { SidebarAsset } from './asset';
import { SidebarCss } from './css';
import { MainController } from '../../controllers/main.controller';
import { IProps } from '../../utils/interface';
import { SideTab } from '../../utils/constant';
import { View } from '../view';

export default class Sidebar extends View {

    componentDidMount() {
        this.mainCtrl.sidebar$.subscribe(()=> this.setState({}));
    }

    icon(iconTag:JSX.Element):JSX.Element {
        iconTag = React.cloneElement(iconTag, {style:styles.baricon})
        return <div style={styles.baricon}>
            {iconTag}
        </div>
    }

    render() {
        const tab = this.mainCtrl.getTab();
        return (
            <div>
                <div style={styles.sidebar}>
                    {this.icon(<FaQuestion onClick={()=>this.mainCtrl.setTab(SideTab.Help)}/>)}
                    {this.icon(<FaFolder onClick={()=>this.mainCtrl.setTab(SideTab.Folder)} />)}
                    {this.icon(<FaReact onClick={()=>this.mainCtrl.setTab(SideTab.State)} />)}
                    {this.icon(<FaCode onClick={()=>this.mainCtrl.setTab(SideTab.Element)} />)}
                    {this.icon(<FaCog onClick={()=>this.mainCtrl.setTab(SideTab.Property)} />)}
                    {this.icon(<FaCss3 onClick={()=>this.mainCtrl.setTab(SideTab.Css)} />)}
                    {this.icon(<FaPalette onClick={()=>this.mainCtrl.setTab(SideTab.Color)} />)}
                    {this.icon(<FaImages onClick={()=>this.mainCtrl.setTab(SideTab.Asset)} />)}
                    {this.icon(<FaSave onClick={()=>this.mainCtrl.export(true)}/>)}
                    {this.icon(<FaFileExport onClick={()=>this.mainCtrl.export()} />)}
                    {this.icon(<FaFileImport onClick={()=>this.mainCtrl.import()}/>)}
                    {this.icon(<FaUndo onClick={()=>this.mainCtrl.undo()} />)}
                    {this.icon(<FaRedo onClick={()=>this.mainCtrl.redo()} />)}

                </div>
                {this.mainCtrl.isInitialized() ? <div style={styles.collapseSidebar}>
                    {tab === SideTab.Help && <SidebarHelp />}
                    {tab === SideTab.Folder && <SidebarFolder />}
                    {tab === SideTab.State && <SidebarState />}
                    {tab === SideTab.Element && <SidebarCode />}
                    {tab === SideTab.Property && <SidebarProperty />}
                    {tab === SideTab.Css && <SidebarCss />}
                    {tab === SideTab.Color && <SidebarColor />}
                    {tab === SideTab.Asset && <SidebarAsset />}
                </div>: <div style={styles.collapseSidebar}>
                    <SidebarHelp />
                </div>}
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
        zIndex:10
    },
    collapseSidebar: {
        transition: '0.5s',
        position:'absolute',
        width: 220,
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
        left:260,
        right:0,
        position: 'absolute',
        overflow:'auto'
    }
}