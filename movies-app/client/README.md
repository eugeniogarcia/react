# Introducción

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

## Pasar parametros a los componentes

A la hora de especificar los componentes en las Route, hemos usado dos opciones:

- Usando una componente estático con `render`. Retorna el jmx a renderizar, y aquí especificamos los props que queremos pasar al componente:

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

