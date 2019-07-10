import React from 'react';
import { RenderService } from './Render.service';
import CodeSandbox from 'react-code-sandbox';
import { Props } from '../redux/Reducers';

export class FrameView extends React.Component<Props> {

    renderService?:RenderService;

    componentWillMount() {
        this.renderService = RenderService.getInstance(RenderService)
    }

    render() {
        if (!this.renderService) return <div></div>
        return <CodeSandbox imports={this.renderService.imp}>
            {this.renderService.getBody()}
        </CodeSandbox>
    }
}