import React from 'react';
import PubsubService from './../service/pubsub.service'
import CodeSandbox from 'react-code-sandbox'
import ReactStrapService from '../service/reactstrap.service'
import { DataManager } from './../manager/data.manager';

export default class Home extends React.Component {

    state = {
        imports: [{library: ReactStrapService, items: ['Container']}],
        code: '<Container></Container>'
    }

    dataManager;

    componentWillMount() {
        this.dataManager = DataManager.getInstance(DataManager);
        PubsubService.sub(PubsubService.KEY_RELOAD_HOME).subscribe(value=> {
            this.setState(this.dataManager.render())
        });
    }

    render() {
        const imp = {React}
        this.state.imports.forEach(lib=> {
            lib.items.forEach(item=> {
                imp[item] = lib.library.get(item)
            })
        })
        return <div id="design">
            <CodeSandbox imports={imp}>
            {'state='+JSON.stringify(this.state.state)+';render(' +this.state.code + ')'}
            </CodeSandbox>
        </div>
    }
}
