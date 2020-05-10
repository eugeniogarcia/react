import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import ReactTable from 'react-table'
import api from '../api'
import PropTypes from "prop-types";

import styled from 'styled-components'

import 'react-table/react-table.css'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

class UpdateMovie1 extends Component {
  constructor(props) {
    super(props);
    this.updateUser = this.updateUser.bind(this);
  }

  updateUser = (event) => {
    event.preventDefault();
    //window.location.href = `/movies/update/${this.props.id}`
    this.props.history.push(`/movies/update/${this.props.id}`);
  };

  render() {
    return <Update onClick={this.updateUser}>Actualiza</Update>;
  }
}
const UpdateMovie=withRouter(UpdateMovie1)

class DeleteMovie extends Component {

    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Estas seguro de querer borrar la película ${this.props.id} ?`,
            )
        ) {
            api.deleteMovieById(this.props.id);
          if (this.props.seborro) this.props.seborro(this.props.id);
          }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Borra</Delete>
    }
}
DeleteMovie.propTypes = {
  seborro: PropTypes.func,
};

class MoviesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      columns: [],
      isLoading: false,
      numfilas: props.filas,
      posicion: props.posicion,
    };
    
    //Callback con el que informaremos al padre cuando se cambia el número de filas. Así el padre puede actualizar su estado
    this.actualizaPadre = props.actualizaFilas;

    //Handlers para cambiar las filas y para borrar
    this.cambioNumfilas = this.cambioNumfilas.bind(this);
    this.borroPeli = this.borroPeli.bind(this);
    this.cambioPosicion = this.cambioPosicion.bind(this);
  }

  cambioPosicion(event) {
    this.setState({ posicion: event });
    if (this.actualizaPadre) this.actualizaPadre({ posicion: event });
  }

  cambioNumfilas(event) {
    this.setState({ numfilas: event });
    if (this.actualizaPadre) this.actualizaPadre({ numfilas: event });
  }

  borroPeli(event) {
    //Las películas que quedan
    const pelis=this.state.movies.filter(x => (x._id !== event));
    //Uso Object.assign para conservar el resto de propiedades del estado
    this.setState(Object.assign(this.state,{movies:pelis}));
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true });

    await api.getAllMovies().then((movies) => {
      this.setState({
        movies: movies.data.data,
        isLoading: false,
      });
    });
  };

  render() {
    const { movies, isLoading, numfilas, posicion } = this.state;
    const fun=this.borroPeli;
    const columns = [
      {
        Header: "ID",
        accessor: "_id",
        filterable: true,
      },
      {
        Header: "Nombre",
        accessor: "name",
        filterable: true,
      },
      {
        Header: "Rating",
        accessor: "rating",
        filterable: true,
      },
      {
        Header: "Duracion",
        accessor: "time",
        Cell: (props) => <span>{props.value.join(" / ")}</span>,
      },
      {
        Header: "",
        accessor: "",
        Cell: function (fila) {
          return (
            <span>
              <DeleteMovie id={fila.original._id} seborro={fun} />
            </span>
          );
        },
      },
      {
        Header: "",
        accessor: "",
        Cell: function (props) {
          return (
            <span>
              <UpdateMovie id={props.original._id} />
            </span>
          );
        },
      },
    ];

    let showTable = true;
    if (!movies.length) {
      showTable = false;
    }

    return (
      <Wrapper>
        {showTable && (
          <ReactTable
            data={movies}
            columns={columns}
            loading={isLoading}
            defaultPageSize={4}
            pageSize={numfilas ? numfilas : undefined}
            showPageSizeOptions={true}
            pageSizeOptions={[2, 4, 6, 8]}
            minRows={0}
            onPageSizeChange={this.cambioNumfilas}
            page={posicion}
            onPageChange={this.cambioPosicion}
          />
        )}
      </Wrapper>
    );
  }
}

MoviesList.propTypes = {
    filas: PropTypes.number.isRequired,
    actualizaFilas: PropTypes.func
};


export default MoviesList
