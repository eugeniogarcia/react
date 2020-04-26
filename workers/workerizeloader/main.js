import elworker from 'workerize-loader!./miworker'

console.log("En main!");

let instance = elworker();  // new is optional

instance.expensive(1000).then(count => {
	console.log(`Ran ${count} loops`)
})

instance.expensive(1000).then((count) => {
  console.log(`Otra prueba con ${count} loops`);
});