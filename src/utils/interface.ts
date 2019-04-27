import { History } from "history";
import { File } from "../models/file";

export interface IProps {
    history?: History;
    children?: JSX.Element;
    root?: File;
}