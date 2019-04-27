import { Singletone } from "../service/singletone";
import { ElementController } from "./element.controller";
import { FileController } from './file.controller';
import { ResourceController } from "./resource.controller";
import { Platform, SideTab } from "../utils/constant";
import { BehaviorSubject } from 'rxjs';
import { Container } from 'reactstrap';
import React from 'react';

export class MainController extends Singletone<MainController> {

    private elementCtrl: ElementController;
    private fileCtrl: FileController;
    private resourceCtrl: ResourceController;

    private _isInitialized = false;
    private _platform!: Platform;
    private _tab:SideTab = SideTab.Help;

    home$ = new BehaviorSubject(false);
    sidebar$ = new BehaviorSubject(false);

    constructor() {
        super();
        this.elementCtrl = ElementController.getInstance(ElementController);
        this.fileCtrl = FileController.getInstance(FileController);
        this.resourceCtrl = ResourceController.getInstance(ResourceController);
    }

    initialize(platform:Platform) {
        this._platform = platform;
        this._isInitialized = true;
        this.fileCtrl.init(platform, this.home$, this.sidebar$);
        this.elementCtrl.init(platform, this.home$, this.sidebar$);
        this.resourceCtrl.init(platform, this.home$, this.sidebar$);
    }

    isInitialized():boolean {
        return this._isInitialized;
    }

    getPlatform():Platform {
        return this._platform;
    }

    getRenderData() {
        return {
            state: {},
            imp: {React, Container},
            code: '<Container></Container>'
        }
    }

    export(useCache=false) {

    }

    import() {

    }

    undo() {

    }

    redo() {

    }

    setTab(tab:SideTab) {
        this._tab = tab;
        this.sidebar$.next(true);
    }

    getTab():SideTab {
        return this._tab;
    }
}