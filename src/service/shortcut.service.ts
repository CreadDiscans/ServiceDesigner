import { Singletone } from "./singletone";
import { fromEvent } from "rxjs";
import PubsubService from "./pubsub.service";
import { HistoryService } from './history.service';
import { DataManager } from '../manager/data.manager';

export class ShortcutService extends Singletone<ShortcutService> {

    isCtrl = false;

    initialize() {
        const dataManager: DataManager = DataManager.getInstance(DataManager);
        const historyService: HistoryService = HistoryService.getInstance(HistoryService);
        fromEvent(document, 'keydown').subscribe((e:any)=> {
            if (dataManager.projectType) {
                if (e.key === 'F1') {
                    PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'folder');
                } else if (e.key === 'F2') {
                    PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'state');
                } else if (e.key === 'F3') {
                    PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
                } else if (e.key === 'F4') {
                    PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'property');
                } else if (e.key === 'F5') {
                    PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'css');
                } else if (e.key === 'F6') {
                    PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'color');
                } else if (e.key === 'F7') {
                    PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'asset');
                } else if (e.key === 'Control') {
                    this.isCtrl = true;
                } else if (this.isCtrl && e.key === 'z') {
                    historyService.undo();
                    e.stopPropagation();
                } else if (this.isCtrl && e.key === 's') {
                    dataManager.export(true);
                }
            }
        });
        fromEvent(document, 'keyup').subscribe((e:any)=> {
            if (e.key === 'Control') {
                this.isCtrl = false;
            }
        });
    }
}