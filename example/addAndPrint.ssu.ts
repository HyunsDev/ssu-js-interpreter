import { Tk } from "../src/token";

export const program = Tk.Program([
    Tk.FunctionDefinition("add", ["a", "b"], [Tk.Return(Tk.Plus("a", "b"))]),
    Tk.Call("print", [Tk.Call("add", [Tk.Number(1), Tk.Number(2)])]),
]);
