import { EvaluationContext } from "../context/EvaluationContext";
import { NodeTracer, tracer } from "../logger";
import { EvaluationUnit } from "../types";
import { FunctionValue, JavascriptValue } from "../value";
import { ExpressionNode } from "./BaseNode";

export class IdentifierNode extends ExpressionNode {
    identifier: string;
    constructor(identifier: string) {
        super();
        this.identifier = identifier;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): EvaluationUnit {
        return context.executionContext.getValue(this.identifier);
    }
}

export class ReturnNode extends ExpressionNode {
    expression: ExpressionNode;

    constructor(expression: ExpressionNode) {
        super();
        this.expression = expression;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): EvaluationUnit {
        const value = yield* this.expression.evaluate(context.getSubContext());
        context.isFinished = true;
        context.value = value;
        return value;
    }
}

export class FunctionCallNode extends ExpressionNode {
    identifier: IdentifierNode;
    args: ExpressionNode[];

    constructor(identifier: IdentifierNode, args: ExpressionNode[]) {
        super();
        this.identifier = identifier;
        this.args = args;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): EvaluationUnit {
        const func = context.executionContext.getValue(
            this.identifier.identifier
        );

        if (
            !(func instanceof FunctionValue) &&
            !(func instanceof JavascriptValue)
        ) {
            throw new Error(
                `함수를 호출할 수 없습니다. (received: ${func.constructor.name})`
            );
        }

        const args = [];
        for (const arg of this.args) {
            const res = yield* arg.evaluate(context.getSubContext());
            args.push(res);
        }

        return yield* context.executionContext.functionCall(
            this.identifier,
            func,
            args
        );
    }
}
