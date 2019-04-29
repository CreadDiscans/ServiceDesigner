import { Link } from 'react-router-dom';

export class ReactRouterDomService {

    static lib:any = {
        Link
    }

    static get(key:any) {
        return ReactRouterDomService.lib[key]
    }
}