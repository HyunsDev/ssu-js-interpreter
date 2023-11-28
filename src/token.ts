import {
    BaseNode,
    ExpressionNode,
    FunctionCallNode,
    FunctionDefinitionNode,
    IdentifierNode,
    NumberLiteralNode,
    PlusOperatorNode,
    ProgramNode,
    StatementNode,
    StringLiteralNode,
} from "./node";

const Program = (nodes: (StatementNode | ExpressionNode)[]): ProgramNode => {
    return new ProgramNode(new StatementNode(nodes));
};

const FunctionDefinition = (
    identifier: string,
    parameters: string[],
    body: (StatementNode | ExpressionNode)[]
): FunctionDefinitionNode => {
    return new FunctionDefinitionNode(
        new IdentifierNode(identifier),
        parameters.map((p) => new IdentifierNode(p)),
        new StatementNode(body)
    );
};

const FunctionCall = (
    identifier: string,
    args: ExpressionNode[]
): FunctionCallNode => {
    return new FunctionCallNode(new IdentifierNode(identifier), args);
};

const Return = (expression: ExpressionNode): ExpressionNode => {
    return expression;
};

const StringLiteral = (value: string): StringLiteralNode => {
    return new StringLiteralNode(value);
};

const NumberLiteral = (value: number): NumberLiteralNode => {
    return new NumberLiteralNode(value);
};

const Plus = (
    left: ExpressionNode | string,
    right: ExpressionNode | string
): PlusOperatorNode => {
    const leftNode = typeof left === "string" ? new IdentifierNode(left) : left;
    const rightNode =
        typeof right === "string" ? new IdentifierNode(right) : right;

    return new PlusOperatorNode(leftNode, rightNode);
};

export const Tk = {
    Program,
    FunctionDefinition,
    FunctionCall,
    Return,
    String: StringLiteral,
    Number: NumberLiteral,
    Plus,
};
