import React from "react";
import PropTypes from "prop-types";

export default class Boton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mensaje: "" };
    this.enviaMensaje = this.enviaMensaje.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(event) {
    const val = event.target.value;
    this.setState(() => ({ mensaje: val }));
  }

  enviaMensaje(event) {
    console.log("Dos");
    event.preventDefault();
    //const val = event.target.mensaje.value;
    //this.props.envio({mensaje:val});
    this.props.envio({ mensaje: this.state.mensaje });
  }

  render() {
    return (
      <form onSubmit={this.enviaMensaje}>
        <label>Mensaje:</label>
        <input
          type="text"
          id="mensaje"
          name="mensaje"
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Envia"/>
      </form>
    );
  }
}

Boton.propTypes = {
  envio: PropTypes.func.isRequired
};