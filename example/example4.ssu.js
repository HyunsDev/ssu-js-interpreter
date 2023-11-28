async function delayPrint(text, ms) {
    await delay(ms);
    print(text);
}

print("1");
promiseAll([
    delayPrint("1", 1000),
    delayPrint("2", 500),
    delayPrint("3", 100),
    delayPrint("4", 200),
]);
print("5");
