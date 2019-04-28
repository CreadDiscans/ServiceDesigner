
import React from 'react';
import { MainController } from './../controllers/main.controller';
import { IProps } from './../utils/interface';

export class View extends React.Component<IProps> {

    mainCtrl:MainController;

    constructor(props:IProps) {
        super(props);
        this.mainCtrl = MainController.getInstance(MainController);
    }
}