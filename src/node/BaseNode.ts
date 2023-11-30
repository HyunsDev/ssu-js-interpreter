import { EvaluationContext } from "../context/EvaluationContext";
import { NodeTracer } from "../logger";
import { ExecuteUnit } from "../types";
import { UndefinedValue } from "../value";

export class BaseNode {
    constructor() {}
}

export class StatementNode extends BaseNode {
    nodes: BaseNode[];

    constructor(nodes: BaseNode[]) {
        super();
        this.nodes = nodes;
    }

    *execute(context: EvaluationContext): ExecuteUnit {
        return new UndefinedValue();
    }
}

export abstract class ExpressionNode extends BaseNode {
    value: any;

    constructor() {
        super();
        this.value = undefined;
    }

    @NodeTracer()
    *evaluate(context: EvaluationContext): ExecuteUnit {
        return new UndefinedValue();
    }
}
