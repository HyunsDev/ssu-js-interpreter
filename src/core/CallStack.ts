import { ExecutionContext } from "../context/ExecutionContext";
import { tracer } from "../logger";
import { Value } from "../value";
import { Interpreter } from "./Interpreter";

export class CallStack {
    interpreter: Interpreter;
    stack: ExecutionContext[] = [];

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }

    run(value?: Value) {
        const context = this.peek();
        const res = context.run(value);
        if (res.done) {
            this.pop();
            return res.value;
        }
    }

    push(context: ExecutionContext): void {
        this.stack.push(context);
        tracer.pushCallStack(context.func.identifier);
    }
    peek() {
        const context = this.stack[this.stack.length - 1];
        return context;
    }
    pop() {
        const context = this.stack.pop();
        if (!context) return;
        tracer.popCallStack();
        return context;
    }
    isEmpty(): boolean {
        return this.stack.length === 0;
    }
}
