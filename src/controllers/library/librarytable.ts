import { LibraryDependency } from "../../models/library";
import { ReactIconsService } from "./react-icons.service";
import { ReactNativeVectorIconsService } from "./react-native-vector-icons.service";
import { ReactNativeService } from "./react-native.service";
import ReactStrapService from "./reactstrap.service";
import { ReactRouterDomService } from './react-router-dom.service';

export const LibraryTable:any = {
    [LibraryDependency.ReactIcon]:ReactIconsService,
    [LibraryDependency.ReactNativeVectorIcon]: ReactNativeVectorIconsService,
    [LibraryDependency.ReactNative]: ReactNativeService,
    [LibraryDependency.Reactscrap]: ReactStrapService,
    [LibraryDependency.ReactRouterDom]: ReactRouterDomService
}