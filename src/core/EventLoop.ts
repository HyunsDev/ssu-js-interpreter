import { ExecutionContext } from "../context/ExecutionContext";
import { Value } from "../value";
import { Interpreter } from "./Interpreter";

export class EventLoop {
    interpreter: Interpreter;

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }

    load(context: ExecutionContext): void {
        this.interpreter.callStack.push(context);
    }

    run(): void {
        let isFinished = false;
        let tempValue: Value | undefined = undefined;
        while (true) {
            isFinished = true;
            if (!this.interpreter.callStack.isEmpty()) {
                tempValue = this.interpreter.callStack.run(tempValue);
                isFinished = false;
            }

            if (!this.interpreter.pendingList.isEmpty()) {
                const pendingList = this.interpreter.pendingList.run();
                for (const pendingItem of pendingList) {
                    this.interpreter.callStack.push(
                        pendingItem.executionContext
                    );
                }
                isFinished = false;
            }

            if (!this.interpreter.eventQueue.isEmpty()) {
                const context = this.interpreter.eventQueue.dequeue();
                if (context) {
                    this.interpreter.callStack.push(context);
                }
                isFinished = false;
            }

            if (isFinished) break;
        }
    }
}
