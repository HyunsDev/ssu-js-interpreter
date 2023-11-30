import { IdentifierNode, JavascriptDefinitionNode } from "../node";

export const PrintDefinition = new JavascriptDefinitionNode(
    new IdentifierNode("print"),
    [new IdentifierNode("value")],
    (value: any) => {
        console.log(value.value);
    }
);
