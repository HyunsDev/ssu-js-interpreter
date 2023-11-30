import { program } from "./example/example5.ssu";
import { Interpreter } from "./interpreter";

const interpreter = new Interpreter();
interpreter.run(program);
