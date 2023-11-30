import { tracer } from "../logger";
import { Value } from "../value";
import { ExecutionContext } from "./ExecutionContext";

/**
 * 표현식을 평가하기 위한 컨텍스트
 * 표현식 체이닝이 발생할 경우 재귀적으로 컨텍스트를 생성한다.
 */
export class EvaluationContext {
    deps: number = 0;
    executionContext: ExecutionContext;
    isFinished: boolean = false;
    value?: Value;

    constructor(executionContext: ExecutionContext, deps: number = 0) {
        this.executionContext = executionContext;
        this.deps = deps;
    }

    getSubContext(): EvaluationContext {
        return new EvaluationContext(this.executionContext, this.deps + 1);
    }
}
