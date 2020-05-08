# Librería workerize

Con esta libreria vamos a poder crear código que se ejecute en otro thread - worker service - facilmente. Podremos crear un módulo javascript "normal":

```js
console.log('En worker!!')

export function expensive(time) {
    let start = Date.now(), count = 0;
    while (Date.now() - start < time) count++;
    return count
}
```

El modulo no tiene nada de particular. En este caso exporta una función. Donde viene la potencia de la librería es a la hora de crear un worker. Podemos "workerizar" el código fácilmente:

```js
import elworker from 'workerize-loader!./miworker'

console.log("En main!!");

let instance = elworker()  // new is optional

instance.expensive(1000).then(count => {
  console.log(`Ran ${count} loops`)
})
```

Empezamos importando la librería apuntando a nuestro worker:

```js
import elworker from 'workerize-loader!./miworker'
```

Creamos una instancia de nuestro worker:

```js
let instance = elworker();
```

Y apartir de aquí los métodos que habíamos exportado en nuestro worker están disponibles como funciones que retornar un __Promise__:

```js
instance.expensive(1000).then(count => {
  console.log(`Ran ${count} loops`)
})
```

Aquí __es importante__ destacar que tenemos que usar __webpack__ para que la linrería se instale correctamente. Creamos un worker

## Instalacion de la libreria

Workerize-loader es más flexible que workerize. Requiere de webpack para instalarla correctamente. Instalamos las librerias.

```ps
npm install --save workerize

npm install -D workerize-loader
```

# Webpack

[Empezar con Webpack](./Webpack.md)
