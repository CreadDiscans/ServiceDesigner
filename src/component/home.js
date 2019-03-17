import React from 'react';
import PubsubService from './../service/pubsub.service';
import CodeSandbox from 'react-code-sandbox'
// import { Button } from 'reactstrap';


export default class Home extends React.Component {

    componentWillMount() {
        PubsubService.sub(PubsubService.KEY_OPEN_PAGE).subscribe(value=> {
            if (value) {
                console.log(value)
            }
        })
    }

    code = '<div> render string </div>'

    render() {
        const A = require('reactstrap').Button
        const code = `
            
            render(
            <A>
                This is a source string
            </A>
            )
        `
        const imp = {React, A}
        console.log(imp)
        return <div>
            <CodeSandbox imports={imp}>
            {code}
            </CodeSandbox>
        </div>
    }
}
