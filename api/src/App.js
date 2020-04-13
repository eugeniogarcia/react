import React from 'react';
import logo from './logo.svg';
import './App.css';
import Boton from './Boton'
import { recuperaComentario } from "./http";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.gestionaResp = this.gestionaResp.bind(this);
  }
  
  gestionaResp(event) {
    const val = event.mensaje;
    recuperaComentario(val)
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function (respuesta) {
        console.log(respuesta.body);
      })
      .catch((err) => {
        console.error(err);
      });

  }

  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <Boton
          mensaje="escriba algo"
          envio={this.gestionaResp}
        />
      </div>
    );
  }
}