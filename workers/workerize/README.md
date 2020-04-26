# Workerize

Workerize es una librería que nos permite utilizar los web workers de una forma más sencilla. Hay otra librerá, workerize-loader, que se permite también exponer un modulo "normal" como un web-worker. Es quizás más util que esta, pero esta la podemos utilzar sin necesitar crear un bundle con webpack.

## Casos de Uso

Tenemos dos formas de utilizar workerize. Una es definiendo un string con el código que queremos ejecutar en un thread separado. La otra forma es definiendo una función. La función se ejecutará en el thread como una suerte de runnable.

## Instalacion

Para instalar la librería:

```ps
npm install --save workerize
```

## Ajustes para usar Workerize

Podemos ver todos los detalles de Workerize en su [página web]("https://github.com/developit/workerize"), pero en esencia estos son los pasos que tenemos que dar para utilizarla.

En primer lugar tendremos una página web en la que hacemos referencia con nuestro programa - esto no tiene que ver con workerize. En nuestro caso tenemos index.html:

```html
<script type="module" src="main.js"></script>
```

Lo que si hay que destacar es que el javascript es un __modulo__. Como én cualquier módulo, podremos importar la librería:

```js
import workerize from "./node_modules/workerize/dist/workerize.m.js";
```

Como hemos explicado antes, podemos crear un worker pasando un string con código o con una funcion.

### Workerize con un String

Lo que hacemos aquí es crear un nuevo thread, y ejecutar en el javascript que pasamos como argumento de workerize. En este caso el javascript esta exponiendo - __export__ - una funcion:

```js
let worker2 = workerize(`
    export function add(a, b) {
        console.log('Mensaje recibido desde un worker:',a,' ',b);
        // simula un retardo
        let start = Date.now();
        while (Date.now()-start < 500);
        return a + b;
    }
`);
```

La función que hemos exportado pasara a ser un método más de nuestro worker. Notese que la función __retorna un `Promise`__:

```js
(async () => {
    console.log('3 + 9 = ', await worker2.add(3, 9));
    console.log('1 + 2 = ', await worker2.add(1, 2));
})();
```

El worker tiene las mísmas propiedades de cualquier worker:

- podremos subscribiernos a `worker2.onmessage= (e)=>{}`
- podemos publicar un mensaje con worker2.postmessage('')
- podemos terminar el worker con `terminate()`

## Workerize con una funcion

Lo que hacemos aquí es crear un nuevo thread, y ejecutar en un runnable. El código a diferencia de lo que sucede en un thread de java sigue latente hasta que no se haga un `worker3.terminate()`. Esto significa que si hacemos un post de un mensaje, el listener en el worker lo tomara y procesara.

```js
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
```

Podemos enviar un mensaje al thread:

```js
worker3.postMessage(3);
```

## Probar la aplicación

Para probar la aplicación podemos hacer:

```ps
npx serve
```

Veremos los resultados en la consola - `CTRL+ALT+I` Chrome.
