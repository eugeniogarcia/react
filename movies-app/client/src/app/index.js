import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { MoviesList, MoviesInsert, MoviesUpdate } from '../pages'
import PropTypes from "prop-types";

import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numfilas: props.filas,
    };
    this.cambioNumfilas = this.cambioNumfilas.bind(this);
  }

  static defaultProps = {
    filas: 2,
  };

  cambioNumfilas(event) {
    this.setState({ numfilas: event });
  }

  render() {
    const { numfilas } = this.state;

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
              />
            )}
          />
          <Route path="/movies/create" exact component={MoviesInsert} />
          <Route path="/movies/update/:id" exact component={MoviesUpdate} />
        </Switch>
      </Router>
    );
  }
}

MoviesList.propTypes = {
  numfilas: PropTypes.number,
};

export default App;
