import { Singletone } from './singletone';
import { LayoutManager } from '../manager/layout.manager';

export class HistoryService extends Singletone {

    static ACTION_LAYOUT_CREATE = 'layout_create';
    // static ACTION_LAYOUT_UPDATE = 'layout_update';
    // static ACTION_LAYOUT_DELETE = 'layout_delete';

    stack = [];
    undoStack = [];

    push(action) {
        console.log(action);
        this.stack.push(action);
        this.undoStack = [];
    }

    undo() {
        if (this.stack.length > 0) {
            const history = this.stack.pop();
            if (history.action === HistoryService.ACTION_LAYOUT_CREATE)  this.deleteLayout(history.childId);
            console.log(history);
            this.undoStack.push(history);
        }
    }

    redo() {
        if (this.undoStack.length > 0) {
            const history = this.undoStack.pop();
            if (history.action === HistoryService.ACTION_LAYOUT_CREATE) this.createLayout(history.parentId, history.child);
            console.log(history);
        }
    }

    createLayout(parentId, elem) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.selected = parentId;
        manager.create(elem);

    }

    deleteLayout(id) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.selected = id;
        manager.delete();
    }
}