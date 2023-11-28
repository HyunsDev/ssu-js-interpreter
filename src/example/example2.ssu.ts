import {
    FunctionCallNode,
    FunctionDefinitionNode,
    IdentifierNode,
    NumberLiteralNode,
    PlusOperatorNode,
    ProgramNode,
    ReturnNode,
    StatementNode,
    StringLiteralNode,
} from "../node";
import { Tk } from "../token";

export const program = Tk.Program([
    Tk.FunctionDefinition(
        "add",
        ["a", "b"],
        [
            Tk.FunctionCall("print", [Tk.String("1")]),
            Tk.Return(Tk.Plus("a", "b")),
        ]
    ),
    Tk.FunctionCall("print", [
        Tk.FunctionCall("add", [Tk.Number(1), Tk.Number(2)]),
    ]),
]);

const detailProgram = new ProgramNode(
    new StatementNode([
        new FunctionDefinitionNode(
            new IdentifierNode("add"),
            [new IdentifierNode("a"), new IdentifierNode("b")],
            new StatementNode([
                new FunctionCallNode(new IdentifierNode("print"), [
                    new StringLiteralNode("1"),
                ]),
                new ReturnNode(
                    new PlusOperatorNode(
                        new IdentifierNode("a"),
                        new IdentifierNode("b")
                    )
                ),
            ])
        ),
        new FunctionCallNode(new IdentifierNode("print"), [
            new FunctionCallNode(new IdentifierNode("add"), [
                new NumberLiteralNode(1),
                new NumberLiteralNode(2),
            ]),
        ]),
    ])
);

/**
 * 함수 정의
 * 함수 실행 print
 *  함수 실행 add
 *
 */

// function add(a, b) {
//     print("1");
//     return a + b;
// }
// add(1, 2)

// print("2");
// Promise(delay(add, 100));
// print("3");
