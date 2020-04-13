import React from 'react';
import logo from './logo.svg';
import './App.css';
import Link from './Link';
import CheckboxWithLabel from './CheckboxWithLabel';
import Boton from './Boton'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.gestionaResp = this.gestionaResp.bind(this);
  }
  
  gestionaResp(event) {
    const val = event.mensaje;
    console.log("valor: "+val);
  }

  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Demostración de Herramientas de Test.</p>
        Periódicos:
        <br />
        <br />
        <Link nombre="Eugenio" apellido="Garcia">
          <a href="www.elpais.com">El Pais</a>
          <br />
          <a href="www.spiegel.de">Der Spiegel</a>
          <br />
          <a href="www.sn.at">Salzburger</a>
        </Link>
        <br />
        <CheckboxWithLabel
          labelOn="Encendido"
          labelOff="Apagado"
        />
        <Boton
          mensaje="escriba algo"
          envio={this.gestionaResp}
        />
      </div>
    );
  }
}