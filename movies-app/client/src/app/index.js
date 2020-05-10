import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
//import { MoviesList, MoviesInsert, MoviesUpdate } from '../pages'
import { MoviesList, MoviesInsert } from '../pages'
import PropTypes from "prop-types";

import 'bootstrap/dist/css/bootstrap.min.css'

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
          <Route path="/movies/update/:id" exact
            //Dos formas equivalentes. Al definir la carga del componente como asincrona webpack puede hacer el split del javascript en dos pedazos. Esta ruta solo se cargara cuando se vaya a utilizar, no será parte de la carga inicial
            /*
            getComponent={(location, callback) => {
              import('../pages/MoviesUpdate')
                .then((x) => callback(null, x));
            }
            */ 
            getComponent={(location, callback) => {
                import('../pages')
                  .then(({ MoviesUpdate }) => callback(null, MoviesUpdate));
              }
          }/>
        </Switch>
      </Router>
    );
  }
}

MoviesList.propTypes = {
  numfilas: PropTypes.number,
};

export default App;

//component = { MoviesUpdate }