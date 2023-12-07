import { GlobalExecutionContext } from "../context/ExecutionContext";
import { ProgramNode } from "../node";
import { CallStack } from "./CallStack";
import { EventLoop } from "./EventLoop";
import { EventQueue } from "./EventQueue";

export class Interpreter {
    callStack: CallStack;
    eventQueue: EventQueue;
    eventLoop: EventLoop;

    constructor() {
        this.callStack = new CallStack(this);
        this.eventQueue = new EventQueue(this);
        this.eventLoop = new EventLoop(this);
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
