import { Platform } from "../utils/constant";
import { File, FileType } from "../models/file";
import { Element } from "../models/element";
import { Library, LibraryDependency } from "../models/library";
import { Controller } from './controller';
import { BehaviorSubject } from 'rxjs';

export class FileController extends Controller {

    Root:File = new File(0, '/', FileType.ROOT);

    init(platform:Platform, home$:BehaviorSubject<boolean>, sidebar$:BehaviorSubject<boolean>) {
        super.init(platform, home$, sidebar$);
        const home:File = new File(1, 'home.js', FileType.FILE);
        if (platform === Platform.React) {
            home.element = new Element('layout', [], '<div className={{class}} style={{style}}>{children}</div>');
            this.Root.children.push()
        } else if (platform === Platform.ReactNative) {
            home.element = new Element('View', [new Library(LibraryDependency.ReactNative, ['View'])], '<View style={{style}}>{children}</View>');
        }
    }
}
