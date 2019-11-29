export default class Utils {
    static deepcopy(obj:any) {
        return JSON.parse(JSON.stringify(obj))
    }

    static loop(item:any, handle:Function) {
        const stack:any = [];
        const localLoop = (parent:any) => {
            handle(parent, stack);
            stack.push(parent);
            if (parent.children !== undefined) {
                parent.children.forEach((child:any)=> localLoop(child));
            }
            stack.pop();
        }
        localLoop(item)
    }

}
