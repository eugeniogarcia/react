import workerize from "./node_modules/workerize/dist/workerize.m.js";

console.log("en main.js");

//Worker tradicional
const worker1=new Worker('worker.js');

worker1.postMessage('Hola worker, como estas?');

worker1.onmessage = (e) => {
    console.log('Mensaje recibido desde el worker1:',e.data);
}

//Worker con workerize. Pasamos un string con código, o una función. Esto se ejecutara en el worker
//En este caso usamos un string, que se ejecutara en el worker
let worker2 = workerize(`
	export function add(a, b) {
        console.log('Mensaje recibido en worker2:',a,' ',b);
		// simula un retardo
		let start = Date.now();
		while (Date.now()-start < 500);
		return a + b;
	}
`);

//Worker con workerize. Pasamos un string con código, o una función. Esto se ejecutara en el worker
//En este caso usamos un string, que se ejecutara en el worker
let worker3 = workerize(
	()=> {
		console.log('Arranca worker 3');
		this.onmessage = (e) => {
			console.log('Valor de entrada', e.data);
			// simula un retardo
			let start = Date.now();
			while (Date.now() - start < 500);
			this.postMessage('Hola main, la respuesta es '+(e.data*e.data));
		}
	});
worker3.onmessage = (e) => {
	console.log('Mensaje recibido desde el worker3:', e.data);
}

(async () => {
    console.log('3 + 9 = ', await worker2.add(3, 9));
	console.log('1 + 2 = ', await worker2.add(1, 2));
	worker3.postMessage(3);
	worker3.postMessage(5);
})();


worker1.postMessage('El worker sigue vivo y coleando');

(async () => {
	console.log('5 + 13 = ', await worker2.add(5, 13));
	console.log('7 + 8 = ', await worker2.add(7, 8));
	worker3.postMessage(3);
	worker3.postMessage(5);
})();
