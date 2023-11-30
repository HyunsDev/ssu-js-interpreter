import chalk from "chalk";
import { FunctionCallNode } from "./node";

const SHOW_NODE = true;

export const logger = {
    output: (from: string, value: any) => {
        console.log(`${chalk.bgBlue(` ${from} `)} ${value}`);
    },
    trace: (from: string, message: any, deps: number = 0) => {
        console.log(`${"  ".repeat(deps)}${chalk.gray(`${from}`)} ${message}`);
    },
    step: (from: string, message: any, deps: number = 0) => {
        console.log(
            `${"  ".repeat(deps)}${chalk.bgGreen(` ${from} `)} ${message}`
        );
    },
};

export class Tracer {
    private stack: {
        name: string;
        deps: number;
    }[] = [];

    constructor() {
        this.stack = [];
    }

    pushCallStack(name: string): void {
        this.stack.push({
            name,
            deps: 0,
        });
        console.log(
            `${"  ".repeat(this.getPosition())}${chalk.bgGreen(` > ${name} `)}`
        );
    }

    popCallStack(): void {
        const stack = this.stack.pop();
        console.log(
            `${"  ".repeat(this.getPosition())}${chalk.bgGreen(
                ` < ${stack?.name} `
            )}`
        );
    }

    pushNode(name: string, deps: number, message = ""): void {
        this.stack[this.stack.length - 1].deps = deps;

        if (!SHOW_NODE) return;
        console.log(
            `${"  ".repeat(this.getPosition())}${chalk.gray(
                `${name}`
            )} ${message}`
        );
    }

    output(name: string, value: any): void {
        console.log(
            `${"  ".repeat(this.getPosition())}${chalk.bold(
                chalk.blue(`${name}`)
            )}: ${value}`
        );
    }

    private getPosition(): number {
        return this.stack.reduce((acc, cur) => acc + cur.deps, 0);
    }
}

export const tracer = new Tracer();

export const NodeTracer = () => {
    return (target: any, propertyKey: any, descriptor?: any) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            if (target.constructor == FunctionCallNode) {
                const func = args[0].executionContext.getValue(
                    this.identifier.identifier
                );

                tracer.pushNode(
                    target.constructor.name,
                    args[0].deps,
                    func.identifier
                );
            } else {
                tracer.pushNode(target.constructor.name, args[0].deps);
            }
            const result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
};
