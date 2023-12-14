import { GlobalExecutionContext } from "../context/ExecutionContext";
import { tracer } from "../logger";
import { ProgramNode } from "../node";
import { CallStack } from "./CallStack";
import { EventLoop } from "./EventLoop";
import { EventQueue } from "./EventQueue";
import { PendingList } from "./PendingList";

export class Interpreter {
    callStack: CallStack;
    eventQueue: EventQueue;
    eventLoop: EventLoop;
    pendingList: PendingList;

    constructor() {
        this.callStack = new CallStack(this);
        this.eventQueue = new EventQueue(this);
        this.eventLoop = new EventLoop(this);
        this.pendingList = new PendingList(this);
        tracer.setInterpreter(this);
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
