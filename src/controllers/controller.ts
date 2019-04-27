import { Singletone } from "../service/singletone";
import { BehaviorSubject } from 'rxjs';
import { Platform } from "../utils/constant";

export class Controller extends Singletone<Controller> {

    protected platform!:Platform;
    protected home$!:BehaviorSubject<boolean>;
    protected sidebar$!:BehaviorSubject<boolean>;

    init(platfrom:Platform, home$:BehaviorSubject<boolean>, sidebar$:BehaviorSubject<boolean>) {
        this.platform = platfrom;
        this.home$ = home$;
        this.sidebar$ = sidebar$;
    }
}