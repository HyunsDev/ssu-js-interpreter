import {
    ExecutionContext,
    GlobalExecutionContext,
} from "./context/ExecutionContext";
import { tracer } from "./logger";
import { ProgramNode } from "./node";
import { Value } from "./value";

class ICallStack {
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

class IMessageQueue {
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

class IEventLoop {
    interpreter: Interpreter;

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }

    load(context: ExecutionContext): void {
        this.interpreter.callStack.push(context);
    }

    run(): void {
        let tempValue: Value | undefined = undefined;
        while (true) {
            if (this.interpreter.callStack.isEmpty()) {
                if (this.interpreter.messageQueue.isEmpty()) {
                    break;
                }
            } else {
                tempValue = this.interpreter.callStack.run(tempValue);
            }
        }
    }
}

export class Interpreter {
    callStack: ICallStack;
    messageQueue: IMessageQueue;
    eventLoop: IEventLoop;

    constructor() {
        this.callStack = new ICallStack(this);
        this.messageQueue = new IMessageQueue(this);
        this.eventLoop = new IEventLoop(this);
    }

    run(program: ProgramNode): void {
        const globalExecutionContext = new GlobalExecutionContext(
            program,
            this
        );
        this.eventLoop.load(globalExecutionContext);
        this.eventLoop.run();
    }
}
