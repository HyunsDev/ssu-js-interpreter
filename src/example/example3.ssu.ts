import { Tk } from "../token";

export const program = Tk.Program([
    Tk.If(Tk.True(), [Tk.Call("print", [Tk.String("true")])]),
    Tk.If(Tk.False(), [], [Tk.Call("print", [Tk.String("false")])]),
]);
