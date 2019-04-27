import { LibraryDependency } from "../../models/library";
import { ReactIconsService } from "./react-icons.service";
import { ReactNativeVectorIconsService } from "./react-native-vector-icons.service";
import { ReactNativeService } from "./react-native.service";
import ReactStrapService from "./reactstrap.service";

export const LibraryTable = {
    [LibraryDependency.ReactIcon]:ReactIconsService,
    [LibraryDependency.ReactNativeVectorIcon]: ReactNativeVectorIconsService,
    [LibraryDependency.ReactNative]: ReactNativeService,
    [LibraryDependency.Reactscrap]: ReactStrapService
}