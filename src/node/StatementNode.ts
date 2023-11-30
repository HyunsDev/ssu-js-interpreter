import { EvaluationContext } from "../context/EvaluationContext";
import { NodeTracer } from "../logger";
import { EvaluationUnit, ExecutionUnit } from "../types";
import { BooleanValue, UndefinedValue } from "../value";
import { BaseNode, ExpressionNode, StatementNode } from "./BaseNode";

// 함수 몸
export class BlockNode extends StatementNode {
    constructor(nodes: BaseNode[]) {
        super(nodes);
    }
}

// 조건문
export class IfStatementNode extends StatementNode {
    condition: ExpressionNode;
    elseNodes?: BaseNode[];

    constructor(
        condition: ExpressionNode,
        nodes: BaseNode[],
        elseNodes?: BaseNode[]
    ) {
        super(nodes);
        this.condition = condition;
        this.elseNodes = elseNodes;
    }

    @NodeTracer()
    *execute(context: EvaluationContext): EvaluationUnit {
        const condition = yield* this.condition.evaluate(
            context.getSubContext()
        );
        if (!(condition instanceof BooleanValue)) {
            throw new Error("if 조건문은 조건은 boolean 타입이어야 합니다.");
        }
        if (condition.value) {
            return yield* context.executionContext.execute(this.nodes);
        } else if (this.elseNodes) {
            return yield* context.executionContext.execute(this.elseNodes);
        }
        return new UndefinedValue();
    }
}

// 반복문
export class WhileStatementNode extends StatementNode {
    condition: ExpressionNode;
    constructor(condition: ExpressionNode, nodes: BaseNode[]) {
        super(nodes);
        this.condition = condition;
    }
}
