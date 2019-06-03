import React from 'react';
import ExplorerView from './Explorer.view';

export class HomeView extends React.Component {
    render() {
        return <div>
                <ExplorerView />
            <iframe></iframe>
        </div>
    }
}