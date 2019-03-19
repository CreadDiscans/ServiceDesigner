export default class Utils {
    static deepcopy(obj) {
        return JSON.parse(JSON.stringify(obj))
    }
}