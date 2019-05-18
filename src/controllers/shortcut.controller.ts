
import { Controller } from './controller';
import { MainController } from './main.controller';
import { fromEvent } from 'rxjs';
import { SideTab } from '../utils/constant';
export class ShortcutController extends Controller {

    private isCtrl = false;
    private isBind = false;

    init(main:MainController) {
        super.init(main);
        if (!this.isBind) {
            this.bindEvent();
            this.isBind = true;
        }
    }

    private bindEvent() {
        fromEvent<KeyboardEvent>(document, 'keydown').subscribe((e:KeyboardEvent)=> {
            if (e.key === 'F1') {
                this.main.setTab(SideTab.Folder);
            } else if (e.key === 'F2') {
                this.main.setTab(SideTab.State);
            } else if (e.key === 'F3') {
                this.main.setTab(SideTab.Element);
            } else if (e.key === 'F4') {
                this.main.setTab(SideTab.Style);
            } else if (e.key === 'F5') {
                this.main.setTab(SideTab.Css);
            } else if (e.key === 'F6') {
                this.main.setTab(SideTab.Color);
            } else if (e.key === 'F7') {
                this.main.setTab(SideTab.Asset);
            } else if (e.key === 'Control') {
                this.isCtrl = true;
            // } else if (this.isCtrl && e.key === 'z') {
            //     this.main.undo();
            //     e.stopPropagation();
            } else if (this.isCtrl && e.key === 's') {
                this.main.export(true);
            }
        });
        fromEvent(document, 'keyup').subscribe((e:any)=> {
            if (e.key === 'Control') {
                this.isCtrl = false;
            }
        });
    }

}