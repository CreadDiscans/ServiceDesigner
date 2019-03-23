import { Singletone } from './singletone';
import { LayoutManager } from '../manager/layout.manager';
import Utils from './utils';

export class HistoryService extends Singletone {

    static ACTION_LAYOUT_CREATE = 'layout_create';
    static ACTION_LAYOUT_UPDATE = 'layout_update';
    // static ACTION_LAYOUT_DELETE = 'layout_delete';

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

    undo() {
        if (this.stack.length > 0) {
            this.state = 'undo';
            const history = this.stack.pop();
            if (history.action === HistoryService.ACTION_LAYOUT_CREATE) this.deleteLayout(history.childId, true);
            else if (history.action === HistoryService.ACTION_LAYOUT_UPDATE) this.updateLayout(history.before, true);
            console.log(this.stack)
            this.undoStack.push(history);
        }
    }

    redo() {
        if (this.undoStack.length > 0) {
            this.state = 'redo';
            const history = this.undoStack.pop();
            if (history.action === HistoryService.ACTION_LAYOUT_CREATE) this.createLayout(history.parentId, history.child);
            else if (history.action === HistoryService.ACTION_LAYOUT_UPDATE) this.updateLayout(history.after)
            console.log(this.undoStack);
        }
    }

    createLayout(parentId, elem, fromUndo=false) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.selected = parentId;
        manager.create(Utils.deepcopy(elem), fromUndo);
    }

    updateLayout(after, fromUndo=false) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.update(Utils.deepcopy(after), fromUndo);
    }

    deleteLayout(id, fromUndo=false) {
        const manager = LayoutManager.getInstance(LayoutManager);
        manager.selected = id;
        manager.delete(fromUndo);
    }
}