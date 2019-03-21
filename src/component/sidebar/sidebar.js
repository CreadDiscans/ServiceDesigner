import React from 'react';
import { 
    FaBars,
    FaFolder,
    FaCode,
    FaCog,
    FaFileImport,
    FaSave
 } from 'react-icons/fa'
import SidebarFolder from './folder';
import SidebarCode from './code';
import SidebarProperty from './property';
import PubsubService from './../../service/pubsub.service';
import DataService from './../../service/data.service';

export default class Sidebar extends React.Component {

    state = {
        collapse: false,
        tab: 'folder',
        page:'',
        layout: {
            component: 'layout',
            style: {},
            property: {},
            import: 'import {Container} from \'reactstrap\'',
            code: '<Container>{children}</Container>',
            collapse: true,
            children: []
        },
        selected: null
    }

    componentWillMount() {
        const loop = (item, action) => {
            action(item);
            item.children.forEach(child=> loop(child, action));
        }

        // const maxId = () => {
        //     let id = 0;
        //     loop(this.state.layout, (item)=> {
        //         if (id < item.id) id = item.id;
        //     });
        //     return id;
        // }

        PubsubService.sub(PubsubService.KEY_OPEN_PAGE).subscribe(page=> {
            if (page) {
                const data = DataService.getLayout(page)
                this.setState({
                    layout: data,
                    page:page
                })
            }
        })
        PubsubService.sub(PubsubService.KEY_LAYOUT_UPDATED).subscribe(value=> {
            if (value) this.setState({});
        })
        PubsubService.sub(PubsubService.KEY_SIDEBAR_LAYOUT_UPDATE).subscribe(obj=> {
            if (obj) {
                if (obj.type === 'collapse') {
                    loop(this.state.layout, (item)=> {
                        if (item.id === obj.id) {
                            item[obj.type] = obj.value;
                        }
                    });
                    this.setState({layout: this.state.layout});
                } else if (obj.type === 'selected') {
                    this.setState({
                        selected: obj.item
                    });
                }
            }
        })
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
                    {this.icon(<FaSave onClick={()=>PubsubService.pub(PubsubService.KEY_SAVE, true)}/>)}
                    {this.icon(<FaFileImport onClick={()=>PubsubService.pub(PubsubService.KEY_LOAD, true)}/>)}
                    {this.icon(<FaFolder onClick={()=>this.setState({collapse: true, tab:'folder'}) } />)}
                    {this.icon(<FaCode onClick={()=>this.setState({collapse: true, tab:'code'}) } />)}
                    {this.icon(<FaCog onClick={()=>this.setState({collapse: true, tab:'property'})} />)}

                </div>
                <div style={{...styles.collapseSidebar, ...{
                    left: this.state.collapse ? 40 : -160
                }}}>
                    {this.state.tab === 'folder' && <SidebarFolder />}
                    {this.state.tab === 'code' && <SidebarCode layout={this.state.layout} selected={this.state.selected}/>}
                    {this.state.tab === 'property' && <SidebarProperty layout={this.state.layout} selected={this.state.selected}/>}
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