import { Singletone } from "../utils/singletone";
import { ElementController } from "./element.controller";
import { FileController } from './file.controller';
import { ResourceController } from "./resource.controller";
import { ShortcutController } from './shortcut.controller';
import { Platform, SideTab, Action } from "../utils/constant";
import { BehaviorSubject } from 'rxjs';
import { Container } from 'reactstrap';
import React from 'react';
import { File } from "../models/file";

export class MainController extends Singletone<MainController> {

    private elementCtrl: ElementController;
    private fileCtrl: FileController;
    private resourceCtrl: ResourceController;
    private shortcutCtrl: ShortcutController;

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
        this.shortcutCtrl = ShortcutController.getInstance(ShortcutController);
    }

    init(platform:Platform) {
        this._platform = platform;
        this._isInitialized = true;
        this.fileCtrl.init(this);
        this.elementCtrl.init(this);
        this.resourceCtrl.init(this);
        this.shortcutCtrl.init(this);
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

    getFolderData():File {
        return this.fileCtrl.getRoot();
    }

    fileControl(action:Action, file:File) {
        this.fileCtrl.control(action, file);
    }
}