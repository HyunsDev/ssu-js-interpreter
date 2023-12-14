import { ExecutionContext } from "../context/ExecutionContext";
import { PendingItem } from "../core/PendingList";
import { IdentifierNode, JavascriptDefinitionNode } from "../node";
import { FunctionValue, NumberValue } from "../value";

export const SetTimeoutDefinition = new JavascriptDefinitionNode(
    new IdentifierNode("setTimeout"),
    [new IdentifierNode("callback"), new IdentifierNode("delay")],
    (ctx, callback: FunctionValue, delay: NumberValue) => {
        const cbExecutionContext = new ExecutionContext(
            callback,
            [],
            ctx.interpreter,
            ctx
        );

        const startedAt = new Date().getTime();
        const pendingItem = new PendingItem(
            cbExecutionContext,
            () => new Date().getTime() >= startedAt + delay.value
        );
        ctx.interpreter.pendingList.add(pendingItem);
        return pendingItem.id;
    }
);
