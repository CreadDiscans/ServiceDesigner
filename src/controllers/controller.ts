import { Singletone } from "../utils/singletone";
import { MainController } from './main.controller';
import { Action, HisotryAction } from "../utils/constant";

export class Controller extends Singletone<Controller> {

    protected main!:MainController;

    init(main:MainController) {
        this.main = main;
    }

    protected control(action:Action, parent:any, before:any, after:any, ctrl:Controller, historyAction:HisotryAction = HisotryAction.Do) {
        if (historyAction === HisotryAction.Do)
            this.main.do(action, parent, before, after, ctrl); 
        this.main.sidebar$.next(true);
        this.main.home$.next(true);   
        document.getElementsByTagName('title')[0].innerText = '*Service Designer';
    }
}