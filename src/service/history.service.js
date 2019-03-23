import { Singletone } from './singletone';
import { LayoutManager } from '../manager/layout.manager';
import Utils from './utils';
import { FolderManager } from '../manager/folder.manager';
import { ElementManager } from './../manager/element.manager';
import PubsubService from './pubsub.service';

export class HistoryService extends Singletone {

    static ACTION_LAYOUT_CREATE = 'layout_create';
    static ACTION_LAYOUT_UPDATE = 'layout_update';
    static ACTION_LAYOUT_DELETE = 'layout_delete';

    static ACTION_FOLDER_CREATE = 'folder_create';
    static ACTION_FOLDER_DELETE = 'folder_delete';

    static ACTION_ELEMENT_CREATE = 'element_create';
    static ACTION_ELEMENT_UPDATE = 'element_update';
    static ACTION_ELEMENT_DELETE = 'element_delete';

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
            console.log(history);
            if (history.action === HistoryService.ACTION_LAYOUT_CREATE) this.deleteLayout(history.childId);
            else if (history.action === HistoryService.ACTION_LAYOUT_UPDATE) this.updateLayout(history.before);
            else if (history.action === HistoryService.ACTION_LAYOUT_DELETE) this.createLayout(history.parentId, history.child); 
            else if (history.action === HistoryService.ACTION_FOLDER_CREATE) this.deleteFolder(history.child.id);
            else if (history.action === HistoryService.ACTION_FOLDER_DELETE) this.createFolder(history.parentId, history.child);
            else if (history.action === HistoryService.ACTION_ELEMENT_CREATE) this.deleteElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_DELETE) this.createElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_UPDATE) this.updateElement(history.before);
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
            else if (history.action === HistoryService.ACTION_FOLDER_CREATE) this.createFolder(history.parentId, history.child);
            else if (history.action === HistoryService.ACTION_FOLDER_DELETE) this.deleteFolder(history.child.id);
            else if (history.action === HistoryService.ACTION_ELEMENT_CREATE) this.createElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_DELETE) this.deleteElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_UPDATE) this.updateElement(history.after);
        }
    }

    createLayout(parentId, elem) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.selected = parentId;
        manager.create(Utils.deepcopy(elem));
        PubsubService.pub(PubsubService.KEY_CHANGE_TAB, 'property');
    }

    updateLayout(after) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.update(Utils.deepcopy(after));
        PubsubService.pub(PubsubService.KEY_CHANGE_TAB, 'property');
    }

    deleteLayout(id) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.selected = id;
        manager.delete();
        PubsubService.pub(PubsubService.KEY_CHANGE_TAB, 'property');
    }

    createFolder(parentId, elem) {
        const manager = FolderManager.getInstance(FolderManager);
        manager.selected = parentId;
        manager.create(elem, FolderManager.TYPE_OBJ);
        PubsubService.pub(PubsubService.KEY_CHANGE_TAB, 'folder');
    }

    deleteFolder(id) {
        const manager = FolderManager.getInstance(FolderManager);
        manager.selected = id;
        manager.delete();
        PubsubService.pub(PubsubService.KEY_CHANGE_TAB, 'folder');
    }

    createElement(elem) {
        const manager = ElementManager.getInstance(ElementManager);
        manager.create(elem);
        PubsubService.pub(PubsubService.KEY_CHANGE_TAB, 'code');
    }

    deleteElement(elem) {
        const manager = ElementManager.getInstance(ElementManager);
        manager.delete(elem.id);
        PubsubService.pub(PubsubService.KEY_CHANGE_TAB, 'code');
    }

    updateElement(elem) {
        const manager = ElementManager.getInstance(ElementManager);
        manager.update(elem);
        PubsubService.pub(PubsubService.KEY_CHANGE_TAB, 'code');
    }
}