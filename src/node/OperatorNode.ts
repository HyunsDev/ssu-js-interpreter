import { EvaluationContext } from "../context/EvaluationContext";
import { NodeTracer } from "../logger";
import { ExecuteUnit } from "../types";
import { BooleanValue, NumberValue } from "../value";
import { ExpressionNode } from "./BaseNode";
import { IdentifierNode } from "./ExpressionNode";

// 연산자
export class OperatorNode extends ExpressionNode {}

// 할당 연산자
export class AssignmentOperatorNode extends OperatorNode {
    left: ExpressionNode;
    right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        super();
        this.left = left;
        this.right = right;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): ExecuteUnit {
        const right = yield* this.right.evaluate(context.getSubContext());

        if (!(this.left instanceof IdentifierNode)) {
            throw new Error(
                `할당 연산자의 왼쪽 피연산자는 식별자이어야 합니다. (received: ${this.left.constructor.name})`
            );
        }

        context.executionContext.environment.environmentRecord[
            this.left.identifier
        ] = right;
        return right;
    }
}

// 비교 연산자
export class ComparisonOperatorNode extends OperatorNode {}

export class EqualityOperatorNode extends ComparisonOperatorNode {
    left: ExpressionNode;
    right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        super();
        this.left = left;
        this.right = right;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): ExecuteUnit {
        const left = yield* this.left.evaluate(context.getSubContext());
        const right = yield* this.right.evaluate(context.getSubContext());

        if (left.constructor !== right.constructor) {
            throw new Error(
                `== 연산자의 피연산자는 같은 타입이어야 합니다. (received: ${left.constructor.name}, ${right.constructor.name})`
            );
        }

        return new BooleanValue(left.value === right.value);
    }
}

// 논리 연산자
export class LogicalOperatorNode extends OperatorNode {}

export class AndOperatorNode extends LogicalOperatorNode {
    left: ExpressionNode;
    right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        super();
        this.left = left;
        this.right = right;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): ExecuteUnit {
        const left = yield* this.left.evaluate(context.getSubContext());
        const right = yield* this.right.evaluate(context.getSubContext());

        if (!(left instanceof BooleanValue)) {
            throw new Error(
                `&& 연산자의 왼쪽 피연산자는 boolean 타입이어야 합니다. (received: ${left.constructor.name})`
            );
        }

        if (!(right instanceof BooleanValue)) {
            throw new Error(
                `&& 연산자의 오른쪽 피연산자는 boolean 타입이어야 합니다. (received: ${right.constructor.name})`
            );
        }

        return new BooleanValue(left.value && right.value);
    }
}

export class OrOperatorNode extends LogicalOperatorNode {
    left: ExpressionNode;
    right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        super();
        this.left = left;
        this.right = right;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): ExecuteUnit {
        const left = yield* this.left.evaluate(context.getSubContext());
        const right = yield* this.right.evaluate(context.getSubContext());

        if (!(left instanceof BooleanValue)) {
            throw new Error(
                `|| 연산자의 왼쪽 피연산자는 boolean 타입이어야 합니다. (received: ${left.constructor.name})`
            );
        }

        if (!(right instanceof BooleanValue)) {
            throw new Error(
                `|| 연산자의 오른쪽 피연산자는 boolean 타입이어야 합니다. (received: ${right.constructor.name})`
            );
        }

        return new BooleanValue(left.value || right.value);
    }
}

export class NotOperatorNode extends LogicalOperatorNode {
    expression: ExpressionNode;

    constructor(expression: ExpressionNode) {
        super();
        this.expression = expression;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): ExecuteUnit {
        const expression = yield* this.expression.evaluate(
            context.getSubContext()
        );

        if (!(expression instanceof BooleanValue)) {
            throw new Error(
                `! 연산자의 피연산자는 boolean 타입이어야 합니다. (received: ${expression.constructor.name})`
            );
        }

        return new BooleanValue(!expression.value);
    }
}

// 산술 연산자
export class ArithmeticOperatorNode extends OperatorNode {}

export class PlusOperatorNode extends ArithmeticOperatorNode {
    left: ExpressionNode;
    right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        super();
        this.left = left;
        this.right = right;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): ExecuteUnit {
        const left = yield* this.left.evaluate(context.getSubContext());
        const right = yield* this.right.evaluate(context.getSubContext());

        if (!(left instanceof NumberValue)) {
            throw new Error(
                `+ 연산자의 왼쪽 피연산자는 숫자여야 합니다. (received: ${left.constructor.name})`
            );
        }

        if (!(right instanceof NumberValue)) {
            throw new Error(
                `+ 연산자의 오른쪽 피연산자는 숫자여야 합니다. (received: ${right.constructor.name})`
            );
        }

        return new NumberValue(left.value + right.value);
    }
}
