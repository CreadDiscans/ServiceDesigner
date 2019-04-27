import { Singletone } from "../service/singletone";
import { MainController } from './main.controller';

export class Controller extends Singletone<Controller> {

    protected main!:MainController;

    init(main:MainController) {
        this.main = main;
    }
}