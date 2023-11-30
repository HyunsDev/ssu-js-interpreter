import { TrueLiteral } from "typescript";
import {
    BaseNode,
    BooleanLiteralNode,
    ExpressionNode,
    FunctionCallNode,
    FunctionDefinitionNode,
    IdentifierNode,
    IfStatementNode,
    NumberLiteralNode,
    PlusOperatorNode,
    ProgramNode,
    ReturnNode,
    StatementNode,
    StringLiteralNode,
} from "./node";
import { TrueValue } from "./value";

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
    return new ReturnNode(expression);
};

const StringLiteral = (value: string): StringLiteralNode => {
    return new StringLiteralNode(value);
};

const NumberLiteral = (value: number): NumberLiteralNode => {
    return new NumberLiteralNode(value);
};

const TrueLiteral = (): BooleanLiteralNode => {
    return new BooleanLiteralNode(true);
};

const FalseLiteral = (): BooleanLiteralNode => {
    return new BooleanLiteralNode(false);
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

const If = (
    condition: ExpressionNode,
    then: BaseNode[],
    otherwise?: BaseNode[]
): IfStatementNode => {
    return new IfStatementNode(condition, then, otherwise);
};

export const Tk = {
    Program,
    FunctionDefinition,
    Call: FunctionCall,
    Return,
    String: StringLiteral,
    Number: NumberLiteral,
    Plus,
    If,
    True: TrueLiteral,
    False: FalseLiteral,
};
