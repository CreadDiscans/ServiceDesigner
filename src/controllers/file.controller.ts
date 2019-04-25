import { Singletone } from "../service/singletone";
import { Platform } from "../utils/constant";
import { File, FileType } from "../models/file";
import { Element } from "../models/element";
import { Library, LibraryDependency } from "../models/library";

export class FileController extends Singletone<FileController> {

    Root:File = new File(0, '/', FileType.ROOT);

    initialize(platform:Platform) {
        const home:File = new File(1, 'home.js', FileType.FILE);
        if (platform === Platform.React) {
            home.element = new Element('layout', [], '<div className={{class}} style={{style}}>{children}</div>');
            this.Root.children.push()
        } else if (platform === Platform.ReactNative) {
            home.element = new Element('View', [new Library(LibraryDependency.ReactNative, ['View'])], '<View style={{style}}>{children}</View>');
        }
    }
}
