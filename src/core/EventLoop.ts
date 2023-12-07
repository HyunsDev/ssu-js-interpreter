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
        let tempValue: Value | undefined = undefined;
        while (true) {
            if (this.interpreter.callStack.isEmpty()) {
                if (this.interpreter.eventQueue.isEmpty()) {
                    break;
                }
            } else {
                tempValue = this.interpreter.callStack.run(tempValue);
            }
        }
    }
}
