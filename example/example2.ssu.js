function add(a, b) {
    console.log("1");
    return a + b;
}

print("2");
Promise(delay(add, 100));
print("3");
