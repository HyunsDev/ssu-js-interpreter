let loop = 0;
function* add(numbers: number[]): any {
    console.log(loop++, numbers);

    if (numbers.length === 2) {
        return numbers[0] + numbers[1];
    }

    const [first, ...rest] = numbers;
    const res = yield* add(rest);
    return first + res;
}

const res = add([1, 2, 3, 4, 5]);
console.log(res.next());
