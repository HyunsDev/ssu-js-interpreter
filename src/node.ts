export class BaseNode {
    constructor() {}
}

export class ExpressionNode extends BaseNode {
    value: any;
    constructor() {
        super();
        this.value = undefined;
    }
}

export class StatementNode extends BaseNode {
    nodes: BaseNode[];

    constructor(nodes: BaseNode[]) {
        super();
        this.nodes = nodes;
    }
}

export abstract class DefinitionNode extends ExpressionNode {
    abstract identifier: IdentifierNode;
}

export class FunctionDefinitionNode extends DefinitionNode {
    identifier: IdentifierNode;
    parameters: IdentifierNode[];
    body: StatementNode;

    constructor(
        identifier: IdentifierNode,
        parameters: IdentifierNode[],
        body: StatementNode
    ) {
        super();
        this.identifier = identifier;
        this.parameters = parameters;
        this.body = body;
    }
}

export class JavascriptDefinitionNode extends DefinitionNode {
    identifier: IdentifierNode;
    parameters: IdentifierNode[];
    func: (...args: any) => any;

    constructor(
        identifier: IdentifierNode,
        parameters: IdentifierNode[],
        func: (...args: any) => any
    ) {
        super();
        this.identifier = identifier;
        this.parameters = parameters;
        this.func = func;
    }
}

export class ProgramNode extends FunctionDefinitionNode {
    constructor(nodes: StatementNode) {
        super(new IdentifierNode("global"), [], nodes);
    }
}

export class ReturnNode extends ExpressionNode {
    expression: ExpressionNode;

    constructor(expression: ExpressionNode) {
        super();
        this.expression = expression;
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
}

export class IdentifierNode extends ExpressionNode {
    identifier: string;
    constructor(identifier: string) {
        super();
        this.identifier = identifier;
    }
}

export type LiteralNodeValue = string | number;
export class LiteralNode extends ExpressionNode {
    value: LiteralNodeValue;
    constructor(value: LiteralNodeValue) {
        super();
        this.value = value;
    }
}

export class StringLiteralNode extends LiteralNode {
    value!: string;
    constructor(value: string) {
        super(value);
    }
}

export class NumberLiteralNode extends LiteralNode {
    value!: number;
    constructor(value: number) {
        super(value);
    }
}

export class OperatorNode extends ExpressionNode {}
export class PlusOperatorNode extends OperatorNode {
    left: ExpressionNode;
    right: ExpressionNode;
    constructor(left: ExpressionNode, right: ExpressionNode) {
        super();
        this.left = left;
        this.right = right;
    }
}

export const getNodeByPosition = (
    node: BaseNode,
    position: number[]
): BaseNode | undefined => {
    if (position.length === 0) {
        return node;
    }

    if (node instanceof StatementNode) {
        return getNodeByPosition(
            node.nodes[position[0]],
            position.slice(1, position.length)
        );
    }
};
