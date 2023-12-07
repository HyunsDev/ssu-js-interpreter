import { ExecutionContext } from "../context/ExecutionContext";
import { Interpreter } from "./Interpreter";

export class MessageQueue {
    interpreter: Interpreter;
    queue: ExecutionContext[] = [];

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }

    enqueue(context: ExecutionContext): void {
        this.queue.push(context);
    }
    dequeue() {
        return this.queue.shift();
    }
    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}
