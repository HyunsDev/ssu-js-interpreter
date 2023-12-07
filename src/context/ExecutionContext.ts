import { BuildInNodes } from "../builtIn";
import { Interpreter } from "../core/Interpreter";
import {
    ExpressionNode,
    IdentifierNode,
    ProgramNode,
    ReturnNode,
    StatementNode,
} from "../node";
import { ExecuteUnit } from "../types";
import {
    FunctionValue,
    JavascriptValue,
    UndefinedValue,
    Value,
} from "../value";
import { EvaluationContext } from "./EvaluationContext";

export type Environment = {
    environmentRecord: Record<string, Value>;
    outerEnvironmentRecord: Record<string, Value>;
};

export class ExecutionContext {
    interpreter: Interpreter;
    func: FunctionValue;
    args: Value[];

    done: boolean = false;
    returnValue: Value = new UndefinedValue();
    private evaluationContext: EvaluationContext;

    environment: Environment;
    evaluationUnit: ExecuteUnit;

    constructor(
        func: FunctionValue,
        args: Value[],
        interpreter: Interpreter,
        parent: ExecutionContext | null = null
    ) {
        this.func = func;
        this.args = args;
        this.interpreter = interpreter;

        // 환경 초기화
        this.environment = {
            environmentRecord: {},
            outerEnvironmentRecord: parent
                ? { ...parent.environment.environmentRecord }
                : {},
        };

        // 매개변수 초기화
        let index = 0;
        for (const arg of this.args) {
            this.environment.environmentRecord[
                this.func.definition.parameters[index++].identifier
            ] = arg;
        }

        this.evaluationUnit = this.execute();
        this.evaluationUnit.next();

        this.evaluationContext = new EvaluationContext(this);
    }

    public run(value?: Value) {
        if (this.func instanceof JavascriptValue) {
            this.done = true;
            const res = this.func.definition.func(...this.args);
            return res;
        }

        const res = this.evaluationUnit.next(value);
        if (res.done) {
            this.done = true;
        }
        return res;
    }

    public *execute(nodes = this.func.definition.body.nodes): ExecuteUnit {
        yield undefined;

        let current = 0;
        while (!this.done) {
            const node = nodes[current];
            if (!node) {
                break;
            }
            current++;

            if (node instanceof ExpressionNode) {
                if (node instanceof ReturnNode) {
                    this.returnValue = yield* node.evaluate(
                        this.evaluationContext
                    );
                    this.done = true;
                    return this.returnValue;
                }
                yield* node.evaluate(this.evaluationContext);
            } else if (node instanceof StatementNode) {
                yield* node.execute(this.evaluationContext);
            }
        }

        return new UndefinedValue();
    }

    public *functionCall(
        identifier: IdentifierNode,
        func: FunctionValue | JavascriptValue,
        args: Value[]
    ): ExecuteUnit {
        yield undefined;

        if (func instanceof JavascriptValue) {
            const res = func.definition.func(...args);
            return res;
        }

        if (func instanceof FunctionValue) {
            const executionContext = new ExecutionContext(
                func,
                args,
                this.interpreter
            );

            this.interpreter.callStack.push(executionContext);
            const res = yield undefined;
            return res;
        }

        throw new Error(`Cannot call ${identifier.identifier}`);
    }

    public getValue(identifier: string): Value {
        const value =
            this.environment.environmentRecord[identifier] ||
            this.environment.outerEnvironmentRecord[identifier];

        if (!value) {
            throw new Error(`Cannot find ${identifier}`);
        }

        return value;
    }
}

export class GlobalExecutionContext extends ExecutionContext {
    constructor(program: ProgramNode, interpreter: Interpreter) {
        program.body.nodes = [...BuildInNodes, ...program.body.nodes];
        const func = new FunctionValue("global", program);
        super(func, [], interpreter);
    }
}
