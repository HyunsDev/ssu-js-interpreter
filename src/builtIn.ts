import { IdentifierNode, JavascriptDefinitionNode } from "./node";

export const builtInPrint = new JavascriptDefinitionNode(
    new IdentifierNode("print"),
    [new IdentifierNode("value")],
    (value: any) => {
        console.log(value);
    }
);

export const BuildInNodes = [builtInPrint];
