import worker from 'workerize-loader!./worker'

console.log("en main.js");

let instance = worker()  // new is optional

instance.expensive(1000).then(count => {
	console.log(`Ran ${count} loops`)
})
