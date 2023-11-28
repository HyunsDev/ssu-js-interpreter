import { Tk } from "../token";

export const program = Tk.Program([
    Tk.FunctionDefinition("a", [], [Tk.Return(Tk.String("hello, world!"))]),
    Tk.FunctionCall("print", [Tk.FunctionCall("a", [])]),
]);

// function a() {
//     print("1");
//     return "hello, world!";
// }
// print(a());
