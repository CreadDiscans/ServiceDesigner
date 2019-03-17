import React from 'react';
import PubsubService from './../service/pubsub.service';
import CodeSandbox from 'react-code-sandbox'
import ReactStrapService from '../service/reactstrap.service';
import homeData from '../resource/home.json' 
import ParserService from '../service/parser.service'

export default class Home extends React.Component {

    state = {
        imports: [{library: ReactStrapService, items: ['Alert', 'Container']}],
        code: '<Container><Alert>This is a source string</Alert></Container>'
    }

    componentWillMount() {
        PubsubService.sub(PubsubService.KEY_OPEN_PAGE).subscribe(value=> {
            if (value) {
                console.log(value)
            }
        })

        ParserService.parse(homeData)
    }

    render() {
        const imp = {React}
        this.state.imports.forEach(lib=> {
            lib.items.forEach(item=> {
                imp[item] = lib.library.get(item)
            })
        })
        
        return <div>
            <CodeSandbox imports={imp}>
            {'render(' +this.state.code + ')'}
            </CodeSandbox>
        </div>
    }
}
