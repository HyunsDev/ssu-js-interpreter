import {
    FunctionDefinitionNode,
    IdentifierNode,
    JavascriptDefinitionNode,
} from "../node";

export const setTimeoutDefinition = new JavascriptDefinitionNode(
    new IdentifierNode("setTimeout"),
    [new IdentifierNode("callback"), new IdentifierNode("delay")],
    (ctx, callback: FunctionDefinitionNode, delay: number) => {}
);
