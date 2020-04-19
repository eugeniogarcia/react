# Instalación/Setup

Crea el esqueleto para una aplicación React:

```js
npx create-react-app todo

cd todo

npm start
```

Instalamos redux:

```ps
npm install --save redux
```

## Redux Dev Tools

1) Instalar la extensión de Chrome. Instalamos el plugin de chrome para las [redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=es). 

2) Instalamos el módulo:

```ps
npm install --save-dev redux-devtools-extension
```

3) En el codigo importamos el modulo:

```js
import devToolsEnhancer from 'remote-redux-devtools';

const store = createStore(rootReducer, devToolsEnhancer());
```

## Remote Redux Dev Tools

1) Instalar la extensión de Chrome. Instalamos el plugin de chrome para las [redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=es). 

2) Instalamos el módulo:

```ps
npm install --save-dev remote-redux-devtools
```

3) En el codigo importamos el modulo:

```js
import devToolsEnhancer from 'remote-redux-devtools';

const store = createStore(rootReducer, devToolsEnhancer());
```

# Redux

En redux tendremos __un estado__ que se almacenara de forma centralizada para toda la aplicación. El estado se almacena en un __contenedor__. Nos podremos subscribir al contenedor para saber cuando cambia el estado, o podemos pegirle al contenedor que nos devuelba todo el estado.

Para modificar el estado que tenemos guardado en el contenedor, el contenedor nos ofrece el método __dispatch__. Dispatch tomara como argumento un __reducer__. 

El reducer es una funcion pura - esto es una funcion inmutable, que no modifica datos - que toma dos argumentos, el estado y un productor de acciones. El objetivo es que el reducer produzca otro estado en funcion del estado de entrada y del productor de acciones. Decir que toma como entrada el estado es un poco _engañoso_, en realidad debería decir estado redux, o una porción del estado redux.

El __productor de acciones__ es una función que retorna una __acción__. Una acción es un pojo. La definición del pojo es libre con la única salvedad de que tiene que incluir un elemento llamado `type`, que sirve para categorizar la acción:

```js
{
  type: 'ADD_CONTACT',
  nombre: 'Eugenio',
  apellido: 'Garcia'
}
```

![Modelo Redux](.\imagenes\new-redux-data-flow-opt.png)

## Ejemplo

Vamos a ver con un ejemplo cuales son los componentes de Redux.

### Estado

El estado de nuestra aplicación:

```js
{
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```

Tenemos en este estado dos elementos:

- todos. Contiene todos los to-dos de nuestra aplicación. Es un array que contiene objetos con dos elementos:

    1 text. Texto de la tarea
    2 completed. Boleano. Indica si la tarea se ha completado o no

- visibilityFilter. Nos indica que to-dos queremos mostrar en la aplicación en cada momento

### Acciones

Las acciones son pojos que tienen una estructura libre - con la única salvedad de que deben contener el elemento `type`. Lo que una acción representa es una información que vamos a utilizar para actualizar nuestro estado. La acción se tiene que procesar con un reducer para dar lugar al "nuevo" estado.

Tipicamente en una aplicación React, cuando el usuario interactua con la aplicación dara lugar a eventos. Cuando queramos que alguno de estos eventos de lugar a un cambio de estado, tendremos que generar una acción. Por ejemplo, estas tres acciones se corresponderían a:

- queramos añadir un to-do
- queramos cambiar el estado de completado/no-completado de un todo
- queramos cambiar el filtro de nuestra aplicación - para que muestre todos los todos, los completados, o los pendientes:

```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

### Generadores de Acciones

Como su propio nombre indica se trata de funciones que crean acciones. Por ejemplo, estos tres generadores estarían creando las acciones descritas en la sección anterior:

```js
let nextTodoId = 0
export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})
```

### Reducers

Los reducers son funciones puras - inmutables - que toman un estado de partida y una accion y dan lugar a un estado final. Cuando decimos estado puede ser todo el estado o una porcion de él. Cuando hablamos de todo el estado hablaremos de un __root reducer__.

Este primer reducer esta diseñado para actualizar una porción del estado, el visibilityFilter. Como todos los reducers tomara un estado de partida y una acción, y dara lugar a un estado de salida. Notese como usamos el `type` de la acción para _ignorar_ aquellas acciones en las que la información no tenga nada que ver con esta porción del estado:

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}
```

Este otro reducer se centra en otra parte del estado, en este caso en el array todos:

```js
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}
```

Seguimos el mismo patron que vimos en el reducer anterior. Nos fijamos primero en el `type`de la acción. Solo nos interesan dos tipos de acción en este reducer, `ADD_TODO` y `COMPLETE_TODO`. Con el primer tipo de acciones lo que hacemos es añadir un nuevo to-do. Con el segundo tipo de acción lo que hacemos es upsert la propiedad completed a true.

Estos reducers trabajan sobre porciones del estado. Necesitamos crear un __root reducer__:

```js
import { combineReducers, createStore } from 'redux'
const reducer = combineReducers({ visibilityFilter, todos })
```

Lo tipico es combinar los diferentes reducers para tener un reducer que actualiza todo el estado.

### Store

El store es el componente donde se guarda el estado. Este componente proporciona metodos para leer el estado y para actualizarlo.

En primer lugar para crear un store necesitamos un root reducer:

```js
const store = createStore(reducer)
```

#### Actualizar el estado

Para actualizar el estado del store. usamos el método dispatch. Dispatch tiene como argumento un productor de acciones:

```js
store.dispatch(addTodo('Esta es una tarea que hay que hacer'))
```

Lo que sucedera es que partiendo del root reducer, el store irá combinando todos los reducers que hemos definido para finalmente dar lugar a un nuevo estado que pasara a actualizarse en el store.

#### Consultar el estado

Para consultar el estado en un determinado momento bastara hacer:

```js
store.getState()
```

Nos podemos subscribir al store para recibir notificaciones en los cambios de estado:

```js
function select(state) {
  return state.some.deep.property
}

let currentValue
function handleChange() {
  //Guarda el estado previo  
  let previousValue = currentValue
  //Obtiene el estado actual
  currentValue = select(store.getState())

  if (previousValue !== currentValue) {
    console.log('Some deep nested property changed from',previousValue,'to',currentValue)
  }
}

//Nos subscribimos a los cambios de estado
const unsubscribe = store.subscribe(handleChange)

unsubscribe()
```

### Integración con React

Todo lo que hemos descrito en las secciones anteriores es Redux "puro". Lo que sigue son helpers para utilizar más fácilmente Redux en el contexto de React.

#### Provider

El __provider__ es un componente de React que se crea en el root de la aplicación y que permite a todos sus componentes hijos acceder al store. El store se hace accesible a los hijos como una prop más del componente.

##### Conectar un Componente

La función connect nos permite:

- mapear en las props del componente la porcíon del estado que nos interese
- asociar a las acciones el método dispatch del store

###### mapStateToProps

mapStateToProps es una función que se llama cuendo el componente se monta, actualiza o cuando se cambia algo en el store. Cuando cualquiera de estas acciones sucede se extrae aquellas porciones del estado que nos interesan en props.

###### mapDispatchToProps

mapDispatchToProps, es un objeto que asocia a todas las acciones con el metódo dispatch del store, de modo que nuestro componente podrá despachar acciones cuando lo requiera. Estos métodos estarán disponibles tambien dentro del props del componente.

# El código

## Acciones (acciones/index.js)

Las acciones son pojos con tienen un elemento `type` y los datos que queramos intercambiar. Por ejemplo, en este caso estamos intercambiando un to-do de nuestra aplicación:

```json
{
  type: 'ADD_TODO',
  id: nextTodoId++,
  tarea
}
```

La estructura del to-do en nuestro ejemplo es un `id` y un texto.

### Productores de Acciones

Los productores de acciones son funciones que producen,... acciones. Por ejemplo, este productor crea un to-do:

```js
let nextTodoId = 0

export const addTodo = tarea => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  tarea
})
```

Observamos como se trata una funcion que en este caso toma un argumento, text, y retorna una acción. Notese el elemento `type` en la acción. En una aplicación cada acción puede contener una porción del estado que queremos guardar en redux. Por ejemplo este otro productor de acciones retorna del estado cual es el setting del filtro - no recupera la lista de to-dos:

```js
export const setVisibilityFilter = filtro => ({
  type: 'SET_VISIBILITY_FILTER',
  filtro
})
```

Este otro productor transporta un `id` - que anticipo sería el id de un determinado to-do. Tenemos libertad para incluir en nuestras acciones aquella parte o partes del estado que nos interese - o la totalidad del estado.

```js
export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})
```

Es bastante habitual que los tipos de las acciones se expongan como constantes:

```js
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
```

## Reducers

### reducers/visibilityFilter.js

Este reducer se encarga de gestionar el `visibilityFilter` de nuestro estado:

```js
const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filtro
    default:
      return state
  }
}

export default visibilityFilter
```

### reducers/todos.js

Este reducer se encarga de gestionar el `todo` de nuestro estado. Nos permite añadir todos al estado, y actualizar el estado de los todo`s (completados / no completados):

```js
const tareas = (estado = {todos:[],total:0}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        todos: [
          ...estado.todos,
          {
            id: action.id,
            text: action.tarea,
            completed: false,
          },
        ],
        total: estado.total + 1};
    case 'TOGGLE_TODO':
      return {
        todos: estado.todos.map((todo) =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        ),
        total: estado.total,
      };
    default:
      return estado;
  }
};

export default tareas;
```

### Root reducer (reducers/index.js)

```js
export default combineReducers({
  tareas:todos,
  visibilidad:visibilityFilter
})
```

#### Estado resultante

El estado sería:

```js
{
  tareas:
    {
      todos:[
        {
          id:0,
          tarea:'Esto es una prueba',
          completed: false
        },
        {
                  {
          id:1,
          tarea:'Esto es otra prueba',
          completed: true
        }
      ],
      total: 2
    }
    visibilidad: 'SHOW_ALL'
}
```

En el root reducer podemos ver cada una de las propiedades del estado:

```js
export default combineReducers({
  tareas:todos,
  visibilidad:visibilityFilter
})
```

Con el reducer `visibilityFilter` podemos ver los valores de visibilidad. Por defecto es __state = VisibilityFilters.SHOW_ALL__:

```js
const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':

...
```

Con el reducer `todos` podemos ver los valores de `tareas`:

```js
const tareas = (estado = {todos:[],total:0}, action) => {
  switch (action.type) {
    case 'ADD_TODO':

...
```

Este sería el valor por defecto:

```js
{
  todos: [],
  total: 0
}
```

## Store (index.js)

Creamos el store en la entrada de la aplicación, en index.js. Notese que se crea con el root reducer. En este ejemplo le estamos añadiendo un middleware para integrar el store con las Dev Tools:

```js
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'

import devToolsEnhancer from 'remote-redux-devtools';

//const store = createStore(rootReducer)
const store = createStore(rootReducer, devToolsEnhancer());
```

## Provider (index.js)

Creamos el Provider como root de la aplicación:

```js
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## Componentes

Los componentes que vamos a utilizar para crear la aplicación son un mix de componentes "normales" y componentes que vamos a conectar con el Provider de redux. Por ejemplo veamos nuestra App. Este componente que habitualmente es el root, es ahora el hijo de Provider que pasa a ser el root. Si vemos la definiciónd de App:

```js
const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)
```

Nada especial, tiene tres hijos:

- Footer
- AddTodo
- VisibleTodoList

### Footer

Se trata de un componente stateles funcional. Tiene otro componente react como hijo, `FilterLink`:

```js
const Footer = () => (
  <div>
    <span>Show: </span>
    <FilterLink filtro={VisibilityFilters.SHOW_ALL}>All</FilterLink>
    <FilterLink filtro={VisibilityFilters.SHOW_ACTIVE}>Active</FilterLink>
    <FilterLink filtro={VisibilityFilters.SHOW_COMPLETED}>Completed</FilterLink>
    <br/>
    <Total etiqueta="Total"/>
  </div>
);
```

#### FilterLink y Link

FilterLink esta conectado a Link. Esto significa dos cosas:

- FilterLink será Link con props adicionales, las que se pasan al hacer el connect
- Que FilterLink será refrescado cuando el estado en Redux cambie

##### FilterLink

La definición de FilterLink es:

```js
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)
```

Los argumentos de connect son:

```js
const mapStateToProps = (state, ownProps) => ({
  estado: ownProps.filtro === state.visibilityFilter
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  enClick: () => dispatch(setVisibilityFilter(ownProps.filtro))
})
```

Por lo tanto esto significa que este componente está conectado con `Link`. ¿Que quiere decir esto?. Que FilterLink es en realidad Link con props extendido. Props tendrá:

- Todo lo que le hayamos pasado a FilterLink. En este caso habra por lo tanto un props.filtro:

```js
<FilterLink filtro={VisibilityFilters.SHOW_COMPLETED}>All</FilterLink>
```

- Todas las propiedades definidas en `mapStateToProps`. En este caso habra por lo tanto un props.estado

```js
estado: ownProps.filtro === state.visibilityFilter
```

- Todas las métodos definidos en `mapDispatchToProps`. En este caso habra un método props.enClick

```js
const mapDispatchToProps = (dispatch, ownProps) => ({
  enClick: () => dispatch(setVisibilityFilter(ownProps.filtro))
})
```

Notese como el método `enClick` lo que hace es un dispatch del action producer que actualiza el filtro del estado redux. Cuando este componente invoque a enClick estaremos actualizando el estado en Redux. Todos los componentes que están conectados con Redux serán refrescados.

##### Link

Link es un Componente normal, pero que tendrá las props que hemos visto que FilterLink le pasa

```js
const Link = ({ estado, children, enClick, filtro }) => (
  <button onClick={enClick} disabled={estado} style={{ marginLeft: "4px",}}>
    {children} ({filtro})
  </button>
);
```

#### Total

En este caso conectamos el componente a Redux, pero solo extendemos las propiedades, no añadimos ningun método.

```js
const total = ({ etiqueta, numero }) => (
  <h3>
    {etiqueta}: {numero}
  </h3>
);

const mapStateToProps = (state, ownProps) => ({
  //numero: state.tareas.todos.length
  numero: state.tareas.total
});

export default connect(mapStateToProps)(total);
```

Tenemos en props la propiedad `etiqueta` y la que hemos incluido con connect, `numero`:

```js
<Total etiqueta="Total"/>
```

### AddTodo

Este componente está también conectado con el proveedor de Redux:

```js
const AddTodo = ({ dispatch }) => {
  let componente_dom

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        console.log(process.env.NODE_ENV);
        if (!componente_dom.value.trim()) {
          return
        }
        dispatch(addTodo(componente_dom.value))
        componente_dom.value = ''
      }}>
        <input ref={node => componente_dom = node} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}

export default connect()(AddTodo)
```

A connect no se le pasan ninguna propiedad o método, con lo que las props en AddTodo serán las "originales". Eso si, usamos `dispatch`, de modo que cuando queremos actualizar el estado tenemos un puntero a la funcion dispatch:

Este componente tiene otra particularidad, que si bien no es de Redux, es interesante mencionar. Estamos accediendo directamente al dom al utilizar la propiedad __`ref`__:

```js
<input ref={node => componente_dom = node} />
```

Lo que hacemos es tomar directamente del dom el valor del input, y cuando submitimos el formulario hacemos un dispatch de la acción con el valor del input. Esto actualizara el estado en Redux, y actualizará los componentes que usen redux.

### VisibleTodoList

No tiene nada especial, es similar a `VisibleTodoList.js`.

# Update. Redux Undo

## Instalación

```ps
npm install --save redux-undo
```

## Desarrollo

Hay que crear un __wrapper alreadedor del reducer__ para que enriquecerlo con una funcion __`undoable()`__.

```js
export default tareas;
```

por:

```js
const undoableTareas = undoable(tareas);
export default undoableTareas;
```

Esto tiene el efecto de alterar el estado. Pasa de ser:

```js
{
  tareas:
    {
      todos:[
        {
          id:0,
          tarea:'Esto es una prueba',
          completed: false
        },
        {
                  {
          id:1,
          tarea:'Esto es otra prueba',
          completed: true
        }
      ],
      total: 2
    }
    visibilidad: 'SHOW_ALL'
}
```

a:

```js
{
  tareas:
    {
      present[
        todos:[
          {
            id:0,
            tarea:'Esto es una prueba',
            completed: false
          },
          {
                    {
            id:1,
            tarea:'Esto es otra prueba',
            completed: true
          },
          {
            id:2,
            tarea:'Una mas',
            completed: true
          }
        ],
        total: 3
      ],
      past[
        todos:[
          {
            id:0,
            tarea:'Esto es una prueba',
            completed: false
          },
          {
                    {
            id:1,
            tarea:'Esto es otra prueba',
            completed: true
          }
        ],
        total: 2
      ],
      future[]
    }
    visibilidad: 'SHOW_ALL'
}
```

Esto es, se añaden las propiedades past, present y future al estado.

