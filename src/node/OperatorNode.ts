import { EvaluationContext } from "../context/EvaluationContext";
import { NodeTracer } from "../logger";
import { EvaluationUnit } from "../types";
import { NumberValue } from "../value";
import { ExpressionNode } from "./BaseNode";

// 연산자
export class OperatorNode extends ExpressionNode {}

// 할당 연산자
export class AssignmentOperatorNode extends OperatorNode {}

// 비교 연산자
export class ComparisonOperatorNode extends OperatorNode {}

// 논리 연산자
export class LogicalOperatorNode extends OperatorNode {}

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
    *evaluate(context: EvaluationContext): EvaluationUnit {
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
