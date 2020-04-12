import React from 'react';
import logo from './logo.svg';
import './App.css';
import Link from './Link';
import CheckboxWithLabel from './CheckboxWithLabel';

function App() {
  return (
    <div className="App">
      <body>
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
        <CheckboxWithLabel labelOn="Encendido" labelOff="Apagado" />
      </body>
    </div>
  );
}

export default App;
