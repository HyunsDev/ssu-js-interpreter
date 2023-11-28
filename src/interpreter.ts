import { ExecutionContext, GlobalExecutionContext } from "./executionContext";
import { ProgramNode } from "./node";

class ICallStack {
    interpreter: Interpreter;
    stack: ExecutionContext[] = [];

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }

    run() {
        const context = this.peek();
        if (context.isDone()) {
            this.pop();
            return context;
        } else {
            context.run();
        }
    }

    push(context: ExecutionContext): void {
        this.stack.push(context);
    }
    peek() {
        return this.stack[this.stack.length - 1];
    }
    pop() {
        return this.stack.pop();
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

    load(context: GlobalExecutionContext): void {
        this.interpreter.callStack.push(context);
    }

    run(): void {
        while (true) {
            if (this.interpreter.callStack.isEmpty()) {
                if (this.interpreter.messageQueue.isEmpty()) {
                    break;
                }
            } else {
                const ctx = this.interpreter.callStack.run();

                console.log(ctx);
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
