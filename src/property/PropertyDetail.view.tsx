import React from 'react';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as propertyActions from './Property.action';
import { Theme } from '../utils/Theme';
import ScrollArea from 'react-scrollbar';
import { PropertyType } from '../utils/constant';
import AceEditor from 'react-ace';
import { IoMdAdd } from 'react-icons/io';
import 'brace/mode/json';
import 'brace/theme/tomorrow_night';

class PropertyDetailView extends React.Component<any> {
    render() {
        let height = 1000;
        if (this.refs.layout) {
            const layout:any = this.refs.layout;
            height = window.innerHeight - layout.offsetTop;
        }
        const { data } = this.props;
        return <div>
            <div style={styles.group}>Property Detail</div>
            <div ref='layout'>
                <ScrollArea style={{height:height}}
                    verticalScrollbarStyle={{backgroundColor:'white'}}>
                        <div style={styles.item}>
                            <div style={styles.itemName}>
                                Key : 
                            </div>
                            <div style={styles.itemValue}>
                                <input style={styles.itemInput} type="text" />
                            </div>
                        </div>
                        <div style={styles.item}>
                            <div style={styles.itemName}>
                                Type : 
                            </div>
                            <div style={styles.itemValue}>
                                <select style={styles.itemInput}>
                                    {Object.values(PropertyType).map(type=> <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={styles.item}>
                            <div style={styles.itemName}>
                                Variable : 
                            </div>
                            <div style={styles.itemValue}>
                                <input style={{verticalAlign:'bottom'}} type="checkbox" />
                            </div>
                        </div>
                        <div style={styles.item}>
                            <div style={styles.itemName}>
                                Value : 
                            </div>
                            <div style={styles.itemValue}>
                                <input style={styles.itemInput} type="text"/>
                            </div>
                            <div style={{marginTop:10}}>
                                <div style={Object.assign({}, styles.badge, styles.badgeActive)} ><span style={styles.badgeText}>+</span></div>
                                <div style={styles.badge}><span style={styles.badgeText}>1</span></div>
                                <input style={styles.itemInput} type="text" placeholder={'Condition'}/>
                                <AceEditor
                                    style={{width:'100%', height: 300}}
                                    theme="tomorrow_night" 
                                    mode="json" 
                                    value={''}
                                    onChange={(value)=> {
                                        // this.setState({value:value})
                                    }}
                                    onValidate={(value)=> {
                                        // let error = false;
                                        // value.forEach(item=> {
                                        //     if (item.type === 'error') error = true;
                                        // });
                                        // if (!error) {
                                        //     const { data } = this.props;
                                        //     try{
                                        //         data.elements.component.state = JSON.parse(this.state.value)
                                        //     } catch(e) {}
                                        // }
                                    }}
                                    showPrintMargin={true}
                                    showGutter={false}
                                    highlightActiveLine={true}
                                    editorProps={{$blockScrolling: Infinity }}
                                    setOptions={{
                                        showLineNumbers: false,
                                        tabSize: 2
                                    }}
                                    />
                            </div>
                        </div>
                </ScrollArea>
            </div>
        </div>
    }
}
const styles:any = {
    group: {
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: Theme.borderColor,
        color:Theme.fontColor,
        fontSize:10,
        fontWeight:600,
        userSelect:'none',
        padding: '5px 10px'
    },
    item: {
        color:Theme.fontColor,
        fontSize:10,
        padding: '2px 10px',
        borderColor: Theme.borderColor
    },
    itemName: {
        display:'inline-block',
        width:'40%',
        textAlign:'right',
        paddingRight:10
    },
    itemValue: {
        display:'inline-block',
        width:'60%',
        paddingRight:0
    },
    itemInput: {
        fontSize:12,
        color:Theme.fontColor,
        backgroundColor:Theme.bgBodyActiveColor,
        borderWidth:0,
        outline:'none',
        width:'100%'
    },
    badge: {
        display:'inline-block',
        width:20,
        height:20,
        background: Theme.borderColor,
        color:Theme.fontColor,
        borderRadius:'50%',
        textAlign:'center',
        cursor:'pointer',
        margin:3
    },
    badgeText: {
        verticalAlign:'middle',
        fontSize:12,
        fontWeight:700
    },
    badgeActive: {
        background: Theme.bgHeadActiveColor,
        color:Theme.fontActiveColor
    }
}

export default connectRouter(
    (state)=> ({
        data: {
            property: state.property
        }
    }),
    (dispatch)=> ({
        PropertyActions: bindActionCreators(propertyActions, dispatch)
    }),
    PropertyDetailView
)