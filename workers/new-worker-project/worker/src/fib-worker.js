const fib = (n) => (n < 2 ? 1 : fib(n - 1) + fib(n - 2));

onmessage = (e) => {
    const { num } = e.data;
    console.log(`Recibe mensaje ${num}`)
    const startTime = new Date().getTime();
    const fibNum = fib(num);
    console.log(`Responde con ${fibNum}`)
    postMessage({
        fibNum,
        time: new Date().getTime() - startTime,
    });
};