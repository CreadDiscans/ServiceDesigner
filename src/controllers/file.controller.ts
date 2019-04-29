import { Platform, Action } from "../utils/constant";
import { File, FileType } from "../models/file";
import { Element } from "../models/element";
import { Controller } from './controller';
import { MainController } from './main.controller';
import Utils from './../utils/utils';

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

    control(action:Action, file:File) {
        Utils.loop(this.root, (item:File)=> {
            if (item.id === file.id) {
                item = file;
            }
        });
        this.main.sidebar$.next(true);
        this.main.home$.next(true);
    }
}
