import { BuildInNodes } from "./builtIn";
import { Interpreter } from "./interpreter";
import {
    BaseNode,
    DefinitionNode,
    ExpressionNode,
    FunctionCallNode,
    FunctionDefinitionNode,
    IdentifierNode,
    JavascriptDefinitionNode,
    LiteralNode,
    OperatorNode,
    PlusOperatorNode,
    ProgramNode,
    ReturnNode,
    StatementNode,
    getNodeByPosition,
} from "./node";
import { copy } from "./utils";
import {
    FunctionValue,
    NumberValue,
    UndefinedValue,
    BaseValue,
    Value,
} from "./value";

export type Environment = {
    environmentRecord: Record<string, BaseValue>;
    outerEnvironmentRecord: Record<string, BaseValue>;
};

export type StepGenerator = Generator<
    StepGenerator | undefined,
    BaseValue,
    any
>;

export class ExecutionContext {
    interpreter: Interpreter;
    func: FunctionValue;
    args: Value[];

    current: number[];
    variableEnvironment!: Environment;
    lexicalEnvironment!: Environment;
    thisBinding: any;

    constructor(func: FunctionValue, args: Value[], interpreter: Interpreter) {
        this.interpreter = interpreter;
        this.func = func;
        this.args = args;

        this.current = [];

        this.initEnvironment();
        this.loadRecord();
    }

    *run() {
        if (this.func.definition instanceof JavascriptDefinitionNode) {
            const res = this.func.definition.func(...this.args);
            return res;
        }

        while (!this.isDone()) {
            const node = this.func.definition.body.nodes[this.current[0]];
            if (!node) break;
            this.current[0]++;

            if (node instanceof ReturnNode) {
                const value = yield* this.step(node);
                return value;
            }

            if (node instanceof FunctionDefinitionNode) {
                this.variableEnvironment.environmentRecord[
                    node.identifier.identifier
                ] = yield* this.step(node);
                continue;
            }

            yield* this.step(node);
        }
    }

    *step(node: BaseNode, deps: number = 0): StepGenerator {
        if (node instanceof LiteralNode) {
            return node.value;
        }

        if (node instanceof OperatorNode) {
            if (node instanceof PlusOperatorNode) {
                const left = yield* this.step(node.left, deps + 1);
                if (!(left instanceof NumberValue)) {
                    throw new Error(`Cannot add ${left}`);
                }

                const right = yield* this.step(node.right, deps + 1);
                if (!(right instanceof NumberValue)) {
                    throw new Error(`Cannot add ${right}`);
                }

                const res = left.value + right.value;
                return res;
            }

            throw new Error(`Unknown operator ${node.constructor.name}`);
        }

        if (node instanceof IdentifierNode) {
            return this.getValue(node.identifier);
        }

        if (node instanceof FunctionCallNode) {
            const func = this.getValue(
                node.identifier.identifier
            ) as FunctionValue;

            const args = [];
            for (const arg of node.args) {
                const res = yield* this.step(arg, deps + 1);
                args.push(res);
            }
            const value = yield* this.functionCall(node.identifier, func, args);
            return value;
        }

        if (node instanceof ReturnNode) {
            const value = yield* this.step(node.expression, deps + 1);
            return value;
        }

        if (node instanceof FunctionDefinitionNode) {
            const value = yield* this.step(node.value, deps + 1);
            return value;
        }

        this.current[deps]++;

        throw new Error(`Unknown node ${node.constructor.name}`);
    }

    _run() {
        if (this.func.definition instanceof JavascriptDefinitionNode) {
            this.func.definition.func(...this.args);
            return;
        }

        while (!this.isDone()) {
            const node = this.func.definition.body.nodes[this.current[0]];
            if (!node) break;
            this.current[0]++;

            console.log(`[ execute ] ${node.constructor.name}`);

            this.current[0]++;
            if (node instanceof FunctionCallNode) {
                const func = this.getValue(node.identifier.identifier);
                if (!(func instanceof FunctionValue)) {
                    throw new Error(
                        `${node.identifier.identifier} is not a function`
                    );
                }

                const value = this.functionCall(
                    node.identifier,
                    func,
                    node.args
                );
            }

            if (node instanceof DefinitionNode) {
                this.variableEnvironment.environmentRecord[
                    node.identifier.identifier
                ] = node;

                console.log(
                    `    - define : ${node.identifier.identifier} = ${node}`
                );
            }
        }
    }

    *functionCall(
        identifier: IdentifierNode,
        func: FunctionValue,
        args: Value[]
    ): Generator<undefined, BaseValue, any> {
        if (!(func.definition instanceof FunctionDefinitionNode)) {
            throw new Error(`${identifier.identifier} is not a function`);
        }
        const context = new FunctionExecutionContext(
            func,
            this,
            args,
            this.interpreter
        );
        this.interpreter.callStack.push(context);
        const res: Value = yield undefined;
        return res;
    }

    isDone() {
        return this.current[0] >= this.func.definition.body.nodes.length;
    }

    private initEnvironment() {
        this.variableEnvironment = {
            environmentRecord: {},
            outerEnvironmentRecord: {},
        };
        this.lexicalEnvironment = {
            environmentRecord: {},
            outerEnvironmentRecord: {},
        };
        this.thisBinding = {};
    }

    private loadRecord() {
        this.variableEnvironment.environmentRecord = {};
        for (const childNode of this.func.definition.body.nodes) {
            if (childNode instanceof DefinitionNode) {
                this.variableEnvironment.environmentRecord[
                    childNode.identifier.identifier
                ] = new UndefinedValue();
            }
        }
        this.lexicalEnvironment = copy(this.variableEnvironment);
    }

    private getValue(identifier: string): BaseValue {
        const value =
            this.variableEnvironment.environmentRecord[identifier] ||
            this.variableEnvironment.outerEnvironmentRecord[identifier];

        if (!value) {
            throw new Error(`Cannot find ${identifier}`);
        }

        return value;
    }
}

export class FunctionExecutionContext extends ExecutionContext {
    parent: ExecutionContext;
    constructor(
        func: FunctionValue,
        parent: ExecutionContext,
        args: Value[],
        interpreter: Interpreter
    ) {
        super(func, args, interpreter);
        this.parent = parent;

        this.loadOuterRecord();
    }

    private loadOuterRecord() {
        this.variableEnvironment.outerEnvironmentRecord = {
            ...this.parent.variableEnvironment.outerEnvironmentRecord,
            ...this.parent.variableEnvironment.environmentRecord,
        };
        this.lexicalEnvironment.outerEnvironmentRecord = copy(
            this.variableEnvironment.outerEnvironmentRecord
        );
    }
}

export class GlobalExecutionContext extends ExecutionContext {
    constructor(node: ProgramNode, interpreter: Interpreter) {
        node.body.nodes = [...BuildInNodes, ...node.body.nodes];

        const func = new FunctionValue("", node);
        super(func, [], interpreter);
    }
}
