console.log('in worker')

this.onmessage = (e) => {
    console.log('Recibi un evento', e.data);
    this.postMessage('Hola main, como estas');
}