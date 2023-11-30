import { tracer } from "./logger";
import { IdentifierNode, JavascriptDefinitionNode } from "./node";

export const builtInPrint = new JavascriptDefinitionNode(
    new IdentifierNode("print"),
    [new IdentifierNode("value")],
    (value: any) => {
        tracer.output("print", value.value);
    }
);

export const BuildInNodes = [builtInPrint];
