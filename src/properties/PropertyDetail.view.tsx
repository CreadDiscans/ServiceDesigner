import React from 'react';
import { connectRouter } from '../redux/connection';

class PropertyDetailView extends React.Component {
    render() {
        return <div></div>
    }
}

export default connectRouter(
    (state)=> ({}),
    (dispatch)=> ({}),
    PropertyDetailView
)