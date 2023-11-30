function* a() {
    yield 1;
    return 2;
}

function* b() {
    yield 4;
    yield yield* a();
    yield 6;
}

console.log(...b());
