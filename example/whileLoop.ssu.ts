import { Tk } from "../src/token";

export const program = Tk.Program([
    Tk.Var("x", Tk.Number(0)),
    Tk.While(Tk.Not(Tk.Equal("x", Tk.Number(5))), [
        Tk.Call("print", ["x"]),
        Tk.Assign("x", Tk.Plus("x", Tk.Number(1))),
    ]),
]);
