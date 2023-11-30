import { EvaluationContext } from "../context/EvaluationContext";
import { NodeTracer } from "../logger";
import { ExpressionNode } from "../node";
import { EvaluationUnit } from "../types";
import {
    BooleanValue,
    NullValue,
    NumberValue,
    StringValue,
    UndefinedValue,
} from "../value";

// 리터럴
export class LiteralNode extends ExpressionNode {
    value: any;
    constructor(value: any) {
        super();
        this.value = value;
    }
}

// 문자열 리터럴
export class StringLiteralNode extends LiteralNode {
    value!: string;
    constructor(value: string) {
        super(value);
    }
    @NodeTracer()
    *evaluate(context: EvaluationContext): EvaluationUnit {
        return new StringValue(this.value);
    }
}

// 숫자 리터럴
export class NumberLiteralNode extends LiteralNode {
    value!: number;
    constructor(value: number) {
        super(value);
    }
    @NodeTracer()
    *evaluate(context: EvaluationContext): EvaluationUnit {
        return new NumberValue(this.value);
    }
}

// 불리언 리터럴
export class BooleanLiteralNode extends LiteralNode {
    value!: boolean;
    constructor(value: boolean) {
        super(value);
    }
    @NodeTracer()
    *evaluate(context: EvaluationContext): EvaluationUnit {
        return new BooleanValue(this.value);
    }
}

// null 리터럴
export class NullLiteralNode extends LiteralNode {
    value!: null;
    constructor(value: null = null) {
        super(value);
    }
    @NodeTracer()
    *evaluate(context: EvaluationContext): EvaluationUnit {
        return new NullValue();
    }
}

// undefined 리터럴
export class UndefinedLiteralNode extends LiteralNode {
    value!: undefined;
    constructor(value: undefined = undefined) {
        super(value);
    }
    @NodeTracer()
    *evaluate(context: EvaluationContext): EvaluationUnit {
        return new UndefinedValue();
    }
}
