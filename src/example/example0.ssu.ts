import { Tk } from "../token";

export const program = Tk.Program([
    Tk.FunctionCall("print", [Tk.String("Hello, world!")]),
]);
// print("Hello, world!");
