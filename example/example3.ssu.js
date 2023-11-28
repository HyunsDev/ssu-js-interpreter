async function add(a, b) {
    await delay(1000);
    console.log("1");
    return a + b;
}

print("2");
await add();
print("3");
