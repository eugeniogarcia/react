# Introducción

## Navegacion con `history`

Con esta aplicación hemos experimentado como conservar el estado al utilizar react-router. Tenemos por un lado un componente padre, App, que define el Router. 

```js
    return (
      <Router>
        <NavBar />
        <Switch>
          <Route path="/movies/list" exact
            render={(props) => (<MoviesList {...props} actualizaFilas={this.cambioNumfilas} filas={numfilas}/>)} />
          <Route path="/movies/create" exact component={MoviesInsert} />
          <Route path="/movies/update/:id" exact component={MoviesUpdate} />
        </Switch>
      </Router>
    );
```

En los componentes que indicamos aquí, bajo `Router`, `NavBar`, `MoviesList`, `MoviesInsert`, y `MoviesUpdate`, cuando tengamos Routes, Links, NavLinks el control estará agrupado bajo este elemento raiz.

A la hora de navegar podemos hacerlo de dos formas:

- Usando funciones del objeto __window__:
  - __window.location.href__ = `/movies/update/${this.props.id}`. En este caso navegamos a una ruta concreta. Lo que va a suceder es que la App sera creada de nuevo. El estado del componente App se inicializará de nuevo,  y se navegara a la ruta indicada, de modo que el componente asociado se cargara de nuevo.
  - __window.location.reload()__. Se refresca la pagina actual. Tiene el mismo efecto en App, hace que se cree de nuevo el componente App, y se navegara al componente correspondiente. Tiene el mismo efecto que si hubieramos refrescado el bavegador
__En resumen, se construye el componente raiz__

- Usando la api de navegación del html5.
  - __this.props.history.push(`/movies/update/${this.props.id}`)__. Esto hace que la navegación sea dentro del dominio de Router, de modo que el __componente App no se reconstruye, y mantiene el estado__. El componente asociado a la ruta se reconstruye
  - __this.props.history.go()__. Recarga la página actual. No causa ningún efecto, de echo es tanto como no hacer nada
__En resumen, NO se construye el componente raiz__, pero se construirá el componente al que hemos navegado

## Pasar propiedades al componente definido en una Route

A la hora de especificar los componentes en las Route, hemos usado dos opciones:

- Usando una componente estático __con `render`__. Retorna el jmx a renderizar, y aquí especificamos los props que queremos pasar al componente:

```js
<Route path="/movies/list" exact render={(props) => (<MoviesList {...props} actualizaFilas={this.cambioNumfilas} filas={numfilas}/>)} />
```

- Especificando directamente el componente con `component`:

```js
<Route path="/movies/create" exact component={MoviesInsert} />
```

## History

Los componentes que usamos con Router tiene en su props un método history que podemos utilizar para conectarnos a la api del navegador. Por ejemplo en `MoviesUpdate` podemos hacer:

```js
    handleUpdateMovie = async () => {
        const { id, name, rating, time } = this.state
        const arrayTime = time.split('/')
        const payload = { name, rating, time: arrayTime }
        await api.updateMovieById(id, payload).then(res => {
            window.alert(`La película se actualizó correctamente`)
            this.setState({name: '', rating: '', time: '', })

            this.props.history.push(`/movies/list`);
        })
    }
```

### Componentes que no se usan en un Route

Cuando tenemos un componente que no se usa en una ruta, pero en el que necesitamos interactuar con la api del navegador, podemos usar `withRouter`, incluido en `react-router-dom`. Esto inyectara en props el método history. primero importamos `withRouter`:

```js
import { withRouter } from "react-router-dom";
```

Hacemos un wrapper con el componente. El componente que usaremos sera el resultado del wrapper:

```js
const UpdateMovie=withRouter(UpdateMovie1);
```

Y en `UpdateMovie` ya podemos usar history:

```js
class UpdateMovie1 extends Component {
  constructor(props) {
    super(props);
    this.updateUser = this.updateUser.bind(this);
  }

  updateUser = (event) => {
    event.preventDefault();
    this.props.history.push(`/movies/update/${this.props.id}`);
  };

  render() {
    return <Update onClick={this.updateUser}>Actualiza</Update>;
  }
}
```

### Hooks

Con `react-router` se incluyen unos [hooks](https://reacttraining.com/react-router/web/api/Hooks) que nos permitirán utilizar la api de navegación desde un componente functional - stateless:

```js
 you may use to navigate.import { useHistory } from "react-router-dom";

function HomeButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/home");
  }

  return (
    <button type="button" onClick={handleClick}>
      Go home
    </button>
  );
}
```

Podemos usar otros hooks:

- useHistory
- useLocation
- useParams
- useRouteMatch

## Trocear js bundles para mejorar el rendimiento 

Podemos usar `Lazy` y `Suspense`:

```js
const MoviesUpdate = lazy(() => import("../pages/MoviesUpdate"));
const MoviesInsert = lazy(() => import("../pages/MoviesInsert"));
```

```js
  render() {
    const { numfilas, posicion } = this.state;
    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <Router>
          <NavBar />
          <Switch>
            <Route path="/movies/create" exact component={MoviesInsert} />
            <Route path="/movies/update/:id" exact component={MoviesUpdate}/>
          </Switch>
        </Router>
      </Suspense>
    );
  }
```

### Obsoleto

Esta era la forma antigua de conseguir el code split:

Para mejorar el [rendimiento](https://medium.com/@addyosmani/progressive-web-apps-with-react-js-part-2-page-load-performance-33b932d97cf2) podemos decirle a webpack que en lugar de generar un bundle con todo el js, que se creen diferentes chunks con el js que se precisa para servir cada una ruta. Podemos lograr esto haciendo que la carga del componente sea asíncrona, y utilizando un import para cargar el componente - el import le indica a Webpack por donde trocear el js.

En nuestro caso por ejemplo

```js
return (
<Route path="/movies/create" exact component={MoviesInsert} />
<Route path="/movies/update/:id" exact
  getComponent={(location, callback) => {
    import('../pages/MoviesUpdate')
      .then((x) => callback(null, x.default));
  }
  /*
  getComponent={(location, callback) => {
      import('../pages')
      .then(({ MoviesUpdate }) => callback(null, MoviesUpdate));
    }
  */
}/>
```

## Variables de entorno

Vamos a explorar las diferentes alternativas para usar variables de entorno en nuestra aplicación react. Para empezar hay que decir que las variables de entorno tienen que tener como prefijo __'REACT_APP_'__. Por ejemplo, en nuestro caso vamos a definir una variable llamada REACT_APP_BD.

Para utilizar la variable en el javascript haremos __'process.env.REACT_APP_BD'__. Por ejemplo:

```js
const baseURL = (process.env.REACT_APP_BD || "http://localhost:3000/api").trim();
```

### Opcion 1. Pasar valor en package.json

En el script de arranque pasamos las variables de entorno. Las variables tienen que estar definidas en el contexto del script, en el contexto de ejecución. Un par de consideraciones:

- La variable de entorno tiene que tener el prefijo `REACT_APP_`. Cuanlquier otra variable será filtrada. Una consideración más, la variable PORT, por ejemplo, es utilizada por reac-scripts para exponer la app. Viene a ser la parte de "node". 
- No basta con que la variable de entorno este definida en el bash, o powershell, o dos, tiene que exportarse para que el script la "vea":

```js
"arr": "set REACT_APP_BD=http://localhost:3001/api && set PORT=3002 && react-scripts start",
"arr1": "set PORT=3002 && react-scripts start",
"arr2": "react-scripts start",
```

#### Ejemplo

En powershell definimos:

```ps
$PORT=3002
$REACT_APP_BD=http://localhost:3002/api
$REACT_APP_BD1=http://localhost:3002/api
```

En nuestra app incluimos:

```js
console.log("NODE_ENV: ", process.env.NODE_ENV);
console.log("PORT: ", process.env.PORT);
console.log("REACT_APP_BD: ", process.env.REACT_APP_BD);
console.log("REACT_APP_BD1: ", process.env.REACT_APP_BD1);
```

Lo que obtendremos es:

```ps
NODE_ENV:  development
index.js:4 PORT:  undefined
index.js:6 REACT_APP_BD:  http://localhost:3001/api 
index.js:7 REACT_APP_BD1:  undefined
index.js:11 baseURL:  http://localhost:3001/api
```

Podemos observar que:

- PORT aparece como undefined. No tiene el prefijo REACT_APP_, así que se filtra. Eso si la variable de entorno se utilizara para exponer la app
- REACT_APP_BD1, si bien esta definida, como no se ha exportado al script, no está disponible
- REACT_APP_BD, está disponible porque tiene el prefijo adecuado, y se ha exportado

### Opcion 2. Usar archivo .env

Creamos un archivo llamado .env y lo colocamos en el raiz. Definimos la variable y su valor:

```txt
REACT_APP_BD=http://localhost:3001/api
```

Arrancamos la aplicación normalmente:

```ps
npm run arr1
```

En este caso no hemos tenido que exportar la variable, simplemente bsata con que este definida en el archivo .env. El resto de reglas aplican, tiene que tener el prefijo definido. Como en el .env también hemos definido la variable PORT, podríamos hacer:

```ps
npm run arr2
```

### Opcion 3. Pasar valor config file

Hemos desarrollado un código a medida que nos permite guardar configuraciones.

En `/src/config/index.js` creamos:

```json
const env = process.env.NODE_ENV;

export const appConfig = {
         api: {
           networkInterface: {
             development: "http://localhost:3000/api",
             staging: "http://localhost:3001/api",
             production: "http://localhost:3003/api",
           }[env],
           // add more here
         },
       };
export default appConfig;
```

Y en `/src/api/index.js` lo usamos como sigue:

```js
import config from "../config";

console.log("config.api.networkInterface: ", config.api.networkInterface);
```

### Build

Cuando hacemos:

```ps
npm run build
```

Las variables con el prefijo REACT_APP_ son sustituidas por su valor, de modo que el js estático que se genera hace referencia al valor disponible para esas variables en el momento de la compilación.