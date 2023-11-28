import { program } from "./example/example3.ssu";
import { Interpreter } from "./interpreter";

const interpreter = new Interpreter();
interpreter.run(program);
