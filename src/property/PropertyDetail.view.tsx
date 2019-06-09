import React from 'react';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as propertyActions from './Property.action';
import { Theme } from '../utils/Theme';

class PropertyDetailView extends React.Component {
    render() {
        return <div>
            <div style={styles.group}>Property Detail</div>
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