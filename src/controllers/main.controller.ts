import { Singletone } from "../utils/singletone";
import { ElementController } from "./element.controller";
import { FileController } from './file.controller';
import { ResourceController } from "./resource.controller";
import { ShortcutController } from './shortcut.controller';
import { Platform, SideTab, Action } from "../utils/constant";
import { BehaviorSubject } from 'rxjs';
import { File, FileType } from "../models/file";
import { RenderController } from "./render.controller";
import { Element } from "../models/element";
import { ResourceType, Resource } from "../models/resource";

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
    private _element!:Element;

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
        this.renderCtrl.init(this);
        this._file = this.fileCtrl.getRoot().children[0];
        this._element = this._file.element ? this._file.element : Element.getReactRootElement();
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

    // file

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

    elementControl(action:Action, elem:Element) {
        this.elementCtrl.control(action, elem);
    }

    // resource

    getResource(type:ResourceType, name:string|undefined=undefined):Array<Resource>|Resource|undefined {
        return this.resourceCtrl.get(type, name)
    }

    resourceControl(action:Action, item:Resource) {
        this.resourceCtrl.control(action, item);
    }
}