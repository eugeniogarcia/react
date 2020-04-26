console.log('En el worker');

const fib = (i) => (i <= 1 ? i : fib(i - 1) + fib(i - 2));

this.onmessage = (event) => {
  postMessage(fib(event.data));
};
