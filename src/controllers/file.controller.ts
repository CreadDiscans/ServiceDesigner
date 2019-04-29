import { Platform, Action, HisotryAction } from "../utils/constant";
import { File, FileType } from "../models/file";
import { Element } from "../models/element";
import { Controller } from './controller';
import { MainController } from './main.controller';

export class FileController extends Controller {

    private root:File = new File(0, '', FileType.ROOT);

    init(main:MainController) {
        super.init(main);
        const home:File = new File(1, 'home.js', FileType.FILE);
        if (main.getPlatform() === Platform.React) {
            home.element = Element.getReactRootElement();
            this.root.children.push(home);
        } else if (main.getPlatform() === Platform.ReactNative) {
            home.element = Element.getReactNativeRootElement();
            this.root.children.push(home);
        }
    }

    setRoot(root:File) {
        this.root = root;
    }

    getRoot():File {
        return this.root;
    }

    control(action:Action, parent:File|undefined, before:File|undefined, after:File|undefined, ctrl:FileController,
            historyAction:HisotryAction = HisotryAction.Do) {
        if (action === Action.Create && parent && after) {
            parent.children.push(after);
        } else if (action === Action.Delete && parent && before) {
            let idx = -1;
            parent.children.forEach((item:File, i:number)=> {
                if (item.id === before.id) {
                    idx = i;
                }
            });
            if (idx !== -1) parent.children.splice(idx, 1);
        } else if (action === Action.Update && parent && before && after) {
            parent.children.forEach((item:File)=> {
                if (item.id === before.id) {
                    item = after
                }
            })
        }
        super.control(action, parent, before, after, ctrl, historyAction);
    }

    parse(json:any):File {
        return File.parse(json);
    }
}
