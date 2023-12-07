import { EvaluationContext } from "../context/EvaluationContext";
import { IdentifierNode, JavascriptDefinitionNode } from "../node";

export const PrintDefinition = new JavascriptDefinitionNode(
    new IdentifierNode("print"),
    [new IdentifierNode("value")],
    (ctx, value: any) => {
        console.log(value.value);
    }
);
