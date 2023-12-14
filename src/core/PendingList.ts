import { ExecutionContext } from "../context/ExecutionContext";
import { Interpreter } from "./Interpreter";

export class PendingItem {
    static idCounter: number = 0;
    public id: number;
    public executionContext: ExecutionContext;
    public condition: () => boolean;

    constructor(executionContext: ExecutionContext, condition: () => boolean) {
        this.executionContext = executionContext;
        this.condition = condition;
        this.id = PendingItem.idCounter++;
    }
}

export class PendingList {
    interpreter: Interpreter;
    pendingList: PendingItem[] = [];

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }

    public isEmpty(): boolean {
        return this.pendingList.length === 0;
    }

    public add(task: PendingItem) {
        this.pendingList.push(task);
    }

    public remove(id: number) {
        const index = this.pendingList.findIndex((item) => item.id === id);
        if (index === -1) throw new Error("PendingTask not found");
        this.pendingList.splice(index, 1);
    }

    public run(): PendingItem[] {
        const res: PendingItem[] = [];
        for (const item of this.pendingList) {
            if (item.condition()) {
                res.push(item);
            }
        }

        for (const item of res) {
            this.remove(item.id);
        }

        return res;
    }
}
