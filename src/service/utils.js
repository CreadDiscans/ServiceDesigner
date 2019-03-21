export default class Utils {
    static deepcopy(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    static loop(item, handle) {
        const localLoop = (parent) => {
            handle(parent);
            parent.children.forEach(child=> localLoop(child));
        }
        localLoop(item)
    }
}