import { FunctionDefinitionNode } from "./node";

export class BaseValue {}

export class StringValue extends BaseValue {
    value: string;
    constructor(value: string) {
        super();
        this.value = value;
    }
}

export class NumberValue extends BaseValue {
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }
}

export class BooleanValue extends BaseValue {
    value: boolean;
    constructor(value: boolean) {
        super();
        this.value = value;
    }
}

export class FunctionValue extends BaseValue {
    identifier: string;
    definition: FunctionDefinitionNode;
    constructor(identifier: string, definition: FunctionDefinitionNode) {
        super();
        this.identifier = identifier;
        this.definition = definition;
    }
}

export class ArrayValue extends BaseValue {}

export class ObjectValue extends BaseValue {}

export class NullValue extends BaseValue {}

export class UndefinedValue extends BaseValue {}

export type Value =
    | StringValue
    | NumberValue
    | BooleanValue
    | FunctionValue
    | ArrayValue
    | ObjectValue
    | NullValue
    | UndefinedValue;
