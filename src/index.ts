import { Interpreter } from "./core/Interpreter";
import { program } from "./example/example2.ssu";

const interpreter = new Interpreter();
interpreter.run(program);
