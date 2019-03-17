import React from 'react';
import PubsubService from './../service/pubsub.service';

export default class Home extends React.Component {

    componentWillMount() {
        PubsubService.sub(PubsubService.KEY_OPEN_PAGE).subscribe(value=> {
            if (value) {
                console.log(value)
            }
        })
    }

    render() {
        return <div>
        </div>
    }
}
