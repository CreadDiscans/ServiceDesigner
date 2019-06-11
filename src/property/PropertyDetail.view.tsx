import React from 'react';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import PropertyAction, * as propertyActions from './Property.action';
import { Theme } from '../utils/Theme';
import ScrollArea from 'react-scrollbar';
import { PropertyType } from '../utils/constant';
import AceEditor from 'react-ace';
import 'brace/mode/css';
import 'brace/mode/json';
import 'brace/theme/tomorrow_night';

class PropertyDetailView extends React.Component<any> {

    state = {
        idx: 0,
        value:'',
        hover:''
    }

    renderValueObject() {
        const { data } = this.props;
        return <div id="property-value-object" style={{marginTop:10}}>
            { data.property.select.type === PropertyType.Object && <div>
                {data.property.select.value.map((obj, i)=> <div key={i}
                    style={Object.assign({}, styles.badge, this.state.idx === i && styles.badgeActive)}
                    onClick={()=> this.setState({idx:i})}>{i}</div>)}
                <div style={{...styles.badge,...{padding:0}}} ><span style={styles.badgeText}>+</span></div>
                <input style={styles.itemInput} placeholder={'Condition'} disabled={this.state.idx === 0} 
                    value={data.property.select.value[this.state.idx].condition}
                    onChange={(e)=>data.property.select.value[this.state.idx].condition = e.target.value}/>
                <AceEditor
                    style={{width:'100%', height: 300}}
                    theme="tomorrow_night" 
                    mode={data.property.select.name === 'style' ? 'css' : 'json'} 
                    value={data.property.select.value[this.state.idx].value}
                    onChange={(value)=> {
                        data.property.select.value[this.state.idx].value = value;
                        this.setState({})
                    }}
                    showPrintMargin={true}
                    showGutter={false}
                    highlightActiveLine={true}
                    editorProps={{$blockScrolling: Infinity }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2
                    }}
                    />
            </div>}
        </div>
    }

    renderValue() {
        const { data } = this.props;
        return <div style={styles.item}>
            <div style={styles.itemName}>
                Value : 
            </div>
            <div style={styles.itemValue}>
                { (data.property.select.type === PropertyType.String || 
                    data.property.select.type === PropertyType.Number || 
                    data.property.select.type === PropertyType.Variable) &&
                    <input id="property-value-input" style={styles.itemInput} 
                        type={data.property.select.type === PropertyType.Number ? 'number' : 'text'} 
                        value={data.property.select.value} 
                        onChange={(e)=> {
                            const { PropertyActions } = this.props;
                            PropertyActions.updateValue(e.target.value);
                        }}/>
                }
                { data.property.select.type === PropertyType.Boolean && 
                    <input id="property-value-input" style={{verticalAlign:'bottom'}} type="checkbox" 
                        checked={data.property.select.value}
                        onChange={()=>{
                            const { PropertyActions } = this.props;
                            PropertyActions.updateValue(!data.property.select.value);
                        }} />}
            </div>
            {this.renderValueObject()}
        </div>
    }

    renderDetail() {
        const { data, PropertyActions } = this.props;
        return <div>
            <div style={styles.item}>
                <div style={styles.itemName}>
                    Key : 
                </div>
                <div style={styles.itemValue}>
                    <input id="property-name-input" style={styles.itemInput} type="text" 
                        value={data.property.select.name}
                        onChange={(e)=> {
                            PropertyActions.updateKey(e.target.value)
                        }}
                        />
                </div>
            </div>
            <div style={styles.item}>
                <div style={styles.itemName}>
                    Type : 
                </div>
                <div style={styles.itemValue}>
                    <select id="property-type-select" style={styles.itemInput} 
                        value={data.property.select.type}
                        onChange={(e)=> {
                            const { PropertyActions } = this.props;
                            PropertyActions.updateType(e.target.value)
                            }}>
                        {Object.keys(PropertyType).map(key=> <option key={key} value={PropertyType[key]}>{key}</option>)}
                    </select>
                </div>
            </div>
            {data.property.select.type !== PropertyType.Function && this.renderValue()}
            {data.property.create &&  <div style={{textAlign:'right'}}>
                <button id="property-submit" style={Object.assign({}, styles.btn, this.state.hover === 'btn' && {background:Theme.bgBodyHoverColor})} 
                    onMouseEnter={()=>this.setState({hover:'btn'})}
                    onMouseLeave={()=>this.setState({hover:undefined})}
                    onClick={()=> {
                    const {PropertyActions} = this.props;
                    PropertyActions.createProperty();
                    this.setState({idx:0, value: ''})
                }}>Save</button>
            </div>}
        </div>
    }

    render() {
        let height = 1000;
        if (this.refs.layout) {
            const layout:any = this.refs.layout;
            height = window.innerHeight - layout.offsetTop;
        }
        return <div>
            <div style={styles.group}>Property Detail</div>
            <div ref='layout'>
                <ScrollArea style={{height:height}}
                    verticalScrollbarStyle={{backgroundColor:'white'}}>
                    {this.renderDetail()}
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
        margin:3,
        padding:2,
        verticalAlign:'top'
    },
    badgeText: {
        verticalAlign:'middle',
        fontSize:12,
        fontWeight:700
    },
    badgeActive: {
        background: Theme.bgHeadActiveColor,
        color:Theme.fontActiveColor
    },
    btn: {
        color:Theme.fontColor,
        background: Theme.bgBodyColor,
        cursor:'pointer',
        borderWidth:0,
        padding:'5px 8px',
        fontSize:14,
        borderRadius: 6
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