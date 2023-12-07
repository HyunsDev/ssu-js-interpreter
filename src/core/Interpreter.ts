import { GlobalExecutionContext } from "../context/ExecutionContext";
import { ProgramNode } from "../node";
import { CallStack } from "./CallStack";
import { EventLoop } from "./EventLoop";
import { MessageQueue } from "./MessageQueue";

export class Interpreter {
    callStack: CallStack;
    messageQueue: MessageQueue;
    eventLoop: EventLoop;

    constructor() {
        this.callStack = new CallStack(this);
        this.messageQueue = new MessageQueue(this);
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
