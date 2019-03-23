import { Singletone } from './singletone';
import { LayoutManager } from '../manager/layout.manager';
import Utils from './utils';
import { FolderManager } from '../manager/folder.manager';
import { ElementManager } from './../manager/element.manager';
import { ColorManager } from './../manager/color.manager';

export class HistoryService extends Singletone {

    static ACTION_LAYOUT_CREATE = 'layout_create';
    static ACTION_LAYOUT_UPDATE = 'layout_update';
    static ACTION_LAYOUT_DELETE = 'layout_delete';
    static ACTION_LAYOUT_STATE = 'layout_state';

    static ACTION_FOLDER_CREATE = 'folder_create';
    static ACTION_FOLDER_DELETE = 'folder_delete';

    static ACTION_ELEMENT_CREATE = 'element_create';
    static ACTION_ELEMENT_UPDATE = 'element_update';
    static ACTION_ELEMENT_DELETE = 'element_delete';

    static ACTION_COLOR_CREATE = 'color_create';
    static ACTION_COLOR_UPDATE = 'color_update';
    static ACTION_COLOR_DELETE = 'color_delete';

    stack = [];
    undoStack = [];
    
    state = 'wait';

    push(action) {
        if (this.state === 'wait') {
            this.stack.push(action);
            this.undoStack = [];
        } else if (this.state === 'undo') {
            this.state = 'wait';
        } else if (this.state === 'redo') {
            this.stack.push(action);
            this.state = 'wait';
        }
    }

    reset() {
        this.state = 'wait';
    }

    flush() {
        this.reset();
        this.stack = [];
        this.undoStack = [];
    }

    undo() {
        if (this.stack.length > 0) {
            this.state = 'undo';
            const history = this.stack.pop();
            if (history.action === HistoryService.ACTION_LAYOUT_CREATE) this.deleteLayout(history.childId);
            else if (history.action === HistoryService.ACTION_LAYOUT_UPDATE) this.updateLayout(history.before);
            else if (history.action === HistoryService.ACTION_LAYOUT_DELETE) this.createLayout(history.parentId, history.child); 
            else if (history.action === HistoryService.ACTION_LAYOUT_STATE) this.updateLayoutState(history.before);
            else if (history.action === HistoryService.ACTION_FOLDER_CREATE) this.deleteFolder(history.child.id);
            else if (history.action === HistoryService.ACTION_FOLDER_DELETE) this.createFolder(history.parentId, history.child);
            else if (history.action === HistoryService.ACTION_ELEMENT_CREATE) this.deleteElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_DELETE) this.createElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_UPDATE) this.updateElement(history.before);
            else if (history.action === HistoryService.ACTION_COLOR_CREATE) this.deleteColor(history.name);
            else if (history.action === HistoryService.ACTION_COLOR_UPDATE) this.updateColor(history.before.name, history.before.color);
            else if (history.action === HistoryService.ACTION_COLOR_DELETE) this.createColor(history.name, history.color);
            this.undoStack.push(history);
        }
    }

    redo() {
        if (this.undoStack.length > 0) {
            this.state = 'redo';
            const history = this.undoStack.pop();
            if (history.action === HistoryService.ACTION_LAYOUT_CREATE) this.createLayout(history.parentId, history.child);
            else if (history.action === HistoryService.ACTION_LAYOUT_UPDATE) this.updateLayout(history.after);
            else if (history.action === HistoryService.ACTION_LAYOUT_DELETE) this.deleteLayout(history.child.id);
            else if (history.action === HistoryService.ACTION_LAYOUT_STATE) this.updateLayoutState(history.after);
            else if (history.action === HistoryService.ACTION_FOLDER_CREATE) this.createFolder(history.parentId, history.child);
            else if (history.action === HistoryService.ACTION_FOLDER_DELETE) this.deleteFolder(history.child.id);
            else if (history.action === HistoryService.ACTION_ELEMENT_CREATE) this.createElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_DELETE) this.deleteElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_UPDATE) this.updateElement(history.after);
            else if (history.action === HistoryService.ACTION_COLOR_CREATE) this.createColor(history.name, history.color);
            else if (history.action === HistoryService.ACTION_COLOR_UPDATE) this.updateColor(history.after.name, history.after.color);
            else if (history.action === HistoryService.ACTION_COLOR_DELETE) this.deleteColor(history.name);
        }
    }

    createLayout(parentId, elem) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.selected = parentId;
        manager.create(Utils.deepcopy(elem));
    }

    updateLayout(after) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.update(Utils.deepcopy(after));
    }

    deleteLayout(id) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.selected = id;
        manager.delete();
    }

    updateLayoutState(state) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.setState(state);
    }

    createFolder(parentId, elem) {
        const manager = FolderManager.getInstance(FolderManager);
        manager.selected = parentId;
        manager.create(elem, FolderManager.TYPE_OBJ);
    }

    deleteFolder(id) {
        const manager = FolderManager.getInstance(FolderManager);
        manager.selected = id;
        manager.delete();
    }

    createElement(elem) {
        const manager = ElementManager.getInstance(ElementManager);
        manager.create(elem);
    }

    deleteElement(elem) {
        const manager = ElementManager.getInstance(ElementManager);
        manager.delete(elem.id);
    }

    updateElement(elem) {
        const manager = ElementManager.getInstance(ElementManager);
        manager.update(elem);
    }

    createColor(name, color) {
        const manager = ColorManager.getInstance(ColorManager);
        manager.create(name, color);
    }

    updateColor(name, color) {
        const manager = ColorManager.getInstance(ColorManager);
        manager.create(name, color);
    }

    deleteColor(name) {
        const manager = ColorManager.getInstance(ColorManager);
        manager.delete(name);
    }
}