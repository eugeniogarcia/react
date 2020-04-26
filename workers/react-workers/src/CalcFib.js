import React from 'react';

import { useWorker } from 'react-hooks-worker';

//const createWorker = () => new Worker('./slow_fib.worker.js', { type: 'module' });

const createWorker = new Worker("./worker.js", { type: "module" });
createWorker.onmessage = (event) => {
  console.log("pi: " + event.data);
};
createWorker.postMessage(33);

const CalcFib = ({ count }) => {

    createWorker.postMessage(count);

/*    const { result, error } = useWorker(createWorker, count);
    if (error) return <div>Error: {error}</div>;
    return <div>Result: {result}</div>;*/
    return <div>Result: </div>;
};

export default CalcFib;


