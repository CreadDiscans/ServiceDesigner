import { Alert } from 'reactstrap';

export default class ReactStrapService {
    
    static instance = null

    static lib = {
        Alert
    }

    // static getInstance() {
    //     if (ReactStrapService.instance === null) {
    //         ReactStrapService.instance = new ReactStrapService() 
    //     }
    //     console.log(ReactStrapService.instance)
    //     return ReactStrapService.instance
    // }

    static get(key) {
        return ReactStrapService.lib[key]
    }

}