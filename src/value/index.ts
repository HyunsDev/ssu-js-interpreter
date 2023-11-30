import { FunctionDefinitionNode, JavascriptDefinitionNode } from "../node";

export abstract class BaseValue {}

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

export class TrueValue extends BooleanValue {
    value = true;
}

export class FalseValue extends BooleanValue {
    value = false;
}

export class NullValue extends BaseValue {
    value = null;
}

export class UndefinedValue extends BaseValue {
    value = undefined;
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

export class JavascriptValue extends BaseValue {
    identifier: string;
    definition: JavascriptDefinitionNode;
    constructor(identifier: string, definition: JavascriptDefinitionNode) {
        super();
        this.identifier = identifier;
        this.definition = definition;
    }
}

export type Value =
    | StringValue
    | NumberValue
    | BooleanValue
    | TrueValue
    | FalseValue
    | NullValue
    | UndefinedValue
    | FunctionValue
    | JavascriptValue;

export type ValueConstructor<T extends Value = Value> = new (
    ...args: any[]
) => T;
