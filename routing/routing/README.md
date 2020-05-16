Crea el esqueleto para una aplicación React:

```ps
npx create-react-app routing

cd routing
```

Para arrancar la aplicación hacemos 

```ps
npm start
```

# index.js

Utilizar react router. Importa los objetos que vamos a utilizar más adelante:

- Router
- Route
- NavLink
- Switch

```js
import {
  Route,
  NavLink,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";

```

En el método routing tenemos:

```js
const routing = (
  <Router>
    <div>
      <ul>
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/users">
            Users
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/contact">
            Contact
          </NavLink>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/users" component={Users} />
        <Route path="/contact" component={Contact} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
);
```

## Router

Contenedor de todas las rutas.

## NavLink

Nos permite incluir links en nuestra página. Estos links activaran rutas. Una alternativa a NavLink es Link. La diferencia es que con Link no se puede aplicar estilos. Con NavLink en este ejemplo tenemos una clase css asociada, activeClassName. Esta clase css tiene un estilo (index.css):

```css
body {
    margin: 0;
    padding: 2rem;
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

.active {
    color: red;
}
```

Cuando seleccionamos alguno de los links se pone en rojo.

## Switch

Nos permite definir una ruta por defecto, default. La última ruta que no tiene ningún path, será la que se active cuando el resto de rutas no se activen. En el ejemplo anterior será la ruta `<Route component={Notfound} />` la que se active cuando ninguna de las otras se active.

## Route

Define una asociación de ruta con componente. Si especificamos `exact` la ruta tendrá que machear exactamente. Por ejemplo en nuestro caso tenemos:

```js
<Route exact path="/" component={App} />
<Route path="/users" component={Users} />
```

SI accedemos a `/` se activara App. Si accedemos a `/users` o a `/users/23` se activara el componente Users.

# Users.js

En el caso de Users queremos tener una navegación adicional. Entonces en el componente Users vamos a incluir otras Route hijas.

```js
render() {
    return (
        <div>
          <h1>Users</h1>
          <strong>select a user</strong>
          <ul>
            <li>
              <Link to="/users/1">User 1 </Link>
            </li>
            <li>
              <Link to="/users/2">User 2 </Link>
            </li>
            <li>
              <Link to="/users/3">User 3 </Link>
            </li>
          </ul>
          <Route path="/users/:id" component={User} />
        </div>

    );
```

Vemos como hemos incluido otra Route, `/users/:id` mapeada a User. De este modo:

- `/user` nos llevara al componente Users
- `/user/23` nos llevara al componente User

Notese que en el caso de esta última ruta estamos definiendo un path parameter. Los path parameters se añaden a las props que se pasan al componente cuando es creado, de modo que podemos acceder a su valor:

```js
const User = ({ match }) => <p>Hola, {match.params.id}</p>;
```

User es un elemento React funcional - stateless. Como argumento los elementos funcionales toman las props. En nuestro caso con {match} esta tomando la propiedad match de props. `match.params` tendrá el diccionario de path parameters.


	