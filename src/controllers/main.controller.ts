import { Singletone } from "../utils/singletone";
import { ElementController } from "./element.controller";
import { FileController } from './file.controller';
import { ResourceController } from "./resource.controller";
import { ShortcutController } from './shortcut.controller';
import { Platform, SideTab, Action, HisotryAction } from "../utils/constant";
import { BehaviorSubject } from 'rxjs';
import { File, FileType } from "../models/file";
import { RenderController } from "./render.controller";
import { Element } from "../models/element";
import { ResourceType, Resource } from "../models/resource";
import { ExportController } from "./export.controller";
import { Controller } from "./controller";
declare var window:any;

export class MainController extends Singletone<MainController> {

    private elementCtrl: ElementController;
    private fileCtrl: FileController;
    private resourceCtrl: ResourceController;
    private shortcutCtrl: ShortcutController;
    private renderCtrl: RenderController;
    private exportCtrl: ExportController;

    private _isInitialized = false;
    private _platform!: Platform;
    private _tab:SideTab = SideTab.Help;
    private _file!:File;
    private _element!:Element;
    private _history:any = [];
    private _undoHistory:any = [];

    home$ = new BehaviorSubject(false);
    sidebar$ = new BehaviorSubject(false);

    constructor() {
        super();
        this.elementCtrl = ElementController.getInstance(ElementController);
        this.fileCtrl = FileController.getInstance(FileController);
        this.resourceCtrl = ResourceController.getInstance(ResourceController);
        this.shortcutCtrl = ShortcutController.getInstance(ShortcutController);
        this.renderCtrl = RenderController.getInstance(RenderController);
        this.exportCtrl = ExportController.getInstance(ExportController);
    }

    init(platform:Platform, root:File|undefined=undefined) {
        this._platform = platform;
        this._isInitialized = true;
        this.fileCtrl.init(this);
        if (root) this.fileCtrl.setRoot(root);
        this.elementCtrl.init(this);
        this.resourceCtrl.init(this);
        this.shortcutCtrl.init(this);
        this.renderCtrl.init(this);
        this.exportCtrl.init(this);
        this._file = this.fileCtrl.getRoot().children[0];
        this._element = this._file.element ? this._file.element : Element.getReactRootElement();
    }

    isInitialized():boolean {
        return this._isInitialized;
    }

    getPlatform():Platform {
        return this._platform;
    }

    getRenderData(file:File|undefined = undefined, selection=true) {
        if (file)
            return this.renderCtrl.render(file, selection);
        else
            return this.renderCtrl.render(this._file);
    }

    export(useCache=false) {
        this.exportCtrl.export(this.fileCtrl.getRoot(), useCache);
    }

    async import():Promise<boolean> {
        return new Promise(async(resolve)=> {
            try {
                const { remote } = window.require('electron')
                const fs = window.require('fs')
                const file = remote.dialog.showOpenDialog({ properties: ['openFile'] })
                if (file[0].indexOf('design.json') === -1) {
                    alert('Only design.json file is supported to import');
                    return;
                }
                fs.readFile(file[0], (err:any, data:any)=> {
                    if (err) throw err
                    const json = JSON.parse(data.toString())
                    this.init(json.platfrom, File.parse(json.root));
                    this.exportCtrl.setCachePath(file[0].replace('design.json',''));
                    return resolve(true);
                })
            } catch(e) {
                return resolve(false);
            }
        })  
    }

    do(action:Action, parent:any, before:any, after:any, ctrl:Controller) {
        this._undoHistory = [];
        if (before) before = before.toJson();
        if (after) after = after.toJson();
        this._history.push({action:action, parent:parent, before:before, after:after, ctrl:ctrl});
    }

    undo() {
        if (this._history.length === 0) return;
        const hist = this._history.pop();
        this._undoHistory.push(hist);
        let action = Action.Update
        if (hist.action === Action.Create) action = Action.Delete;
        if (hist.action === Action.Delete) action = Action.Create;
        let after;
        let before;
        if (hist.before) before = hist.ctrl.parse(hist.before);
        if (hist.after) after = hist.ctrl.parse(hist.after);
        hist.ctrl.control(action, hist.parent, after, before, hist.ctrl, HisotryAction.Undo);
    }

    redo() {
        if (this._undoHistory.length === 0) return;
        const hist = this._undoHistory.pop();
        this._history.push(hist);
        let after;
        let before;
        if (hist.before) before = hist.ctrl.parse(hist.before);
        if (hist.after) after = hist.ctrl.parse(hist.after);
        hist.ctrl.control(hist.action, hist.parent, before, after, hist.ctrl, HisotryAction.Redo);
    }

    setTab(tab:SideTab) {
        this._tab = tab;
        this.sidebar$.next(true);
    }

    getTab():SideTab {
        return this._tab;
    }

    // file

    getFolderData():File {
        return this.fileCtrl.getRoot();
    }


    fileControl(action:Action, parent:File|undefined, before:File|undefined, after:File|undefined) {
        this.fileCtrl.control(action, parent, before, after, this.fileCtrl);
    }

    selectFile(file:File) {
        if (file.type === FileType.FILE) {
            this._file = file;
            this.home$.next(true);
            this.sidebar$.next(true);
        }
    }

    getSelectedFile():File {
        return this._file;
    }

    // Element

    selectElement(elem:Element) {
        this._element = elem;
        this.home$.next(true);
        this.sidebar$.next(true);
    }

    getElements() {
        if (this._platform === Platform.React) {
            return this.elementCtrl.reactElements;
        } else if (this._platform === Platform.ReactNative) {
            return this.elementCtrl.reactNativeElments;
        }
    }

    getSelectedElement():Element {
        return this._element;
    }

    elementControl(action:Action, parent:Element|undefined, before:Element|undefined,
            after:Element|undefined) {
        this.elementCtrl.control(action, parent, before, after, this.elementCtrl);
    }

    // resource

    getResource(type:ResourceType, name:string|undefined=undefined):Array<Resource>|Resource|undefined {
        return this.resourceCtrl.get(type, name)
    }

    resourceControl(action:Action, before:Resource|undefined, after:Resource|undefined) {
        this.resourceCtrl.control(action, undefined, before, after, this.resourceCtrl);
    }
}