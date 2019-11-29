import React from 'react';
import { RenderService } from './Render.service';
import CodeSandbox from 'react-code-sandbox';

export class FrameView extends React.Component<any> {

    renderService;

    componentWillMount() {
        this.renderService = RenderService.getInstance(RenderService)
    }

    render() {
        return <CodeSandbox imports={this.renderService.imp}>
            {this.renderService.getBody()}
        </CodeSandbox>
    }
}