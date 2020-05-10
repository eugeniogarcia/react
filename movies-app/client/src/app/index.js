import React, { Component } from 'react'
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
//import { MoviesList, MoviesInsert, MoviesUpdate } from '../pages'
import PropTypes from "prop-types";

import 'bootstrap/dist/css/bootstrap.min.css'

const MoviesUpdate = lazy(() => import("../pages/MoviesUpdate"));
const MoviesInsert = lazy(() => import("../pages/MoviesInsert"));
const MoviesList = lazy(() => import("../pages/MoviesList"));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numfilas: props.filas,
      posicion: props.posicion
    };
    this.cambioNumfilas = this.cambioNumfilas.bind(this);
  }

  static defaultProps = {
    filas: 2,
    posicion:0
  };

  cambioNumfilas(event) {
    this.setState(event);
  }

  render() {
    const { numfilas, posicion } = this.state;
    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <Router>
          <NavBar />
          <Switch>
            <Route
              path="/movies/list"
              exact
              render={(props) => (
                <MoviesList
                  {...props}
                  actualizaFilas={this.cambioNumfilas}
                  filas={numfilas}
                  posicion={posicion}
                />
              )}
            />
            <Route path="/movies/create" exact component={MoviesInsert} />
            <Route path="/movies/update/:id" exact component={MoviesUpdate}/>
          </Switch>
        </Router>
      </Suspense>
    );
  }
}

MoviesList.propTypes = {
  numfilas: PropTypes.number,
};

export default App;

//component = { MoviesUpdate }