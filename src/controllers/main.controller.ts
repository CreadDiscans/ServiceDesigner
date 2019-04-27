import { Singletone } from "../utils/singletone";
import { ElementController } from "./element.controller";
import { FileController } from './file.controller';
import { ResourceController } from "./resource.controller";
import { ShortcutController } from './shortcut.controller';
import { Platform, SideTab, Action } from "../utils/constant";
import { BehaviorSubject } from 'rxjs';
import { Container } from 'reactstrap';
import React from 'react';
import { File, FileType } from "../models/file";
import { RenderController } from "./render.controller";

export class MainController extends Singletone<MainController> {

    private elementCtrl: ElementController;
    private fileCtrl: FileController;
    private resourceCtrl: ResourceController;
    private shortcutCtrl: ShortcutController;
    private renderCtrl: RenderController;

    private _isInitialized = false;
    private _platform!: Platform;
    private _tab:SideTab = SideTab.Help;
    private _file!:File;

    home$ = new BehaviorSubject(false);
    sidebar$ = new BehaviorSubject(false);

    constructor() {
        super();
        this.elementCtrl = ElementController.getInstance(ElementController);
        this.fileCtrl = FileController.getInstance(FileController);
        this.resourceCtrl = ResourceController.getInstance(ResourceController);
        this.shortcutCtrl = ShortcutController.getInstance(ShortcutController);
        this.renderCtrl = RenderController.getInstance(RenderController);
    }

    init(platform:Platform) {
        this._platform = platform;
        this._isInitialized = true;
        this.fileCtrl.init(this);
        this.elementCtrl.init(this);
        this.resourceCtrl.init(this);
        this.shortcutCtrl.init(this);
        this._file = this.fileCtrl.getRoot().children[0];
    }

    isInitialized():boolean {
        return this._isInitialized;
    }

    getPlatform():Platform {
        return this._platform;
    }

    getRenderData() {
        return this.renderCtrl.render(this._file);
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

    selectFile(file:File) {
        if (file.type === FileType.FILE) {
            this._file = file;
            this.home$.next(true);
        }
    }

    getSelectedFile():File {
        return this._file;
    }
}