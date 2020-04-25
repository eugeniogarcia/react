console.log("en main.js");
const worker=new Worker('worker.js');

worker.postMessage('Hola worker, como estas?');

worker.onmessage = (e) => {
    console.log('Mensaje recibido desde un worker:',e.data);
}