import React from 'react';
import { connectRouter } from '../redux/connection';

class AssetView extends React.Component {

    render() {
        return <div></div>
    }
}

export default connectRouter(
    (state)=> ({}),
    (dispatch)=> ({}),
    AssetView
)