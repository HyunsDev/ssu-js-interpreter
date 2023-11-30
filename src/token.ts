import {
    AndOperatorNode,
    BaseNode,
    BooleanLiteralNode,
    EqualityOperatorNode,
    ExpressionNode,
    FunctionCallNode,
    FunctionDefinitionNode,
    IdentifierNode,
    IfStatementNode,
    NotOperatorNode,
    NumberLiteralNode,
    OrOperatorNode,
    PlusOperatorNode,
    ProgramNode,
    ReturnNode,
    StatementNode,
    StringLiteralNode,
    VariableDefinitionNode,
    WhileStatementNode,
} from "./node";

const arg = (arg: ExpressionNode | string): ExpressionNode => {
    return typeof arg === "string" ? new IdentifierNode(arg) : arg;
};

const Program = (nodes: (StatementNode | ExpressionNode)[]): ProgramNode => {
    return new ProgramNode(new StatementNode(nodes));
};

const Identifier = (identifier: string): IdentifierNode => {
    return new IdentifierNode(identifier);
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
    args: (ExpressionNode | string)[]
): FunctionCallNode => {
    return new FunctionCallNode(
        new IdentifierNode(identifier),
        args.map((e) => arg(e))
    );
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
    return new PlusOperatorNode(arg(left), arg(right));
};

const If = (
    condition: ExpressionNode | string,
    then: BaseNode[],
    otherwise?: BaseNode[]
): IfStatementNode => {
    return new IfStatementNode(arg(condition), then, otherwise);
};

const While = (
    condition: ExpressionNode | string,
    body: BaseNode[]
): WhileStatementNode => {
    return new WhileStatementNode(arg(condition), body);
};

const Var = (
    identifier: string,
    expression?: ExpressionNode
): VariableDefinitionNode => {
    return new VariableDefinitionNode(
        new IdentifierNode(identifier),
        expression
    );
};

const Assign = (
    identifier: string,
    expression: ExpressionNode | string
): VariableDefinitionNode => {
    return new VariableDefinitionNode(
        new IdentifierNode(identifier),
        arg(expression)
    );
};

const Equal = (
    left: ExpressionNode | string,
    right: ExpressionNode | string
): EqualityOperatorNode => {
    return new EqualityOperatorNode(arg(left), arg(right));
};

const And = (
    left: ExpressionNode | string,
    right: ExpressionNode | string
): AndOperatorNode => {
    return new AndOperatorNode(arg(left), arg(right));
};

const Or = (
    left: ExpressionNode | string,
    right: ExpressionNode | string
): OrOperatorNode => {
    return new OrOperatorNode(arg(left), arg(right));
};

const Not = (expression: ExpressionNode | string): NotOperatorNode => {
    return new NotOperatorNode(arg(expression));
};

export const Tk = {
    Identifier,
    Program,
    FunctionDefinition,
    Call: FunctionCall,
    Return,
    String: StringLiteral,
    Number: NumberLiteral,
    Plus,
    If,
    While,
    True: TrueLiteral,
    False: FalseLiteral,
    Var,
    Equal,
    And,
    Or,
    Not,
    Assign,
};
