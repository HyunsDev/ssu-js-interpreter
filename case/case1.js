/**
 * Case 1
 * 1초 뒤에 success를 출력하는 비동기 함수
 */

console.log("func1");

new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("promise1");
        resolve("success");
    }, 1000);
});

console.log("func2");
