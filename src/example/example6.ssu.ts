import { Tk } from "../token";

export const program = Tk.Program([
    Tk.FunctionDefinition("ping", [], [Tk.Call("print", [Tk.String("pong")])]),
    Tk.Call("setTimeout", [Tk.Identifier("ping"), Tk.Number(1000)]),
]);
