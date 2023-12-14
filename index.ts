import { program } from "./example/whileLoop.ssu";
import { Interpreter } from "./src";

const interpreter = new Interpreter();
interpreter.run(program);
