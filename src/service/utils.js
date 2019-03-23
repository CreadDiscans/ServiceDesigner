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

    static maxId(item) {
        let id = 0;
        Utils.loop(item, (child=> {
            if (id < child.id) {
                id = child.id;
            }
        }));
        return id;
    }

    static equal(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }
}