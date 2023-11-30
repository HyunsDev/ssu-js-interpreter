import { UndefinedValue, Value } from "../value";

export type EvaluationUnit = Generator<EvaluationUnit | undefined, Value, any>;

export type ExecutionUnit = Generator<
    ExecutionUnit | undefined,
    UndefinedValue,
    any
>;
