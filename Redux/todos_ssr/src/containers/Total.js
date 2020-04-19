import { connect } from 'react-redux'
import React from "react";

const total = ({ etiqueta, numero }) => (
  <h3>
    {etiqueta}: {numero}
  </h3>
);


const mapStateToProps = (state, ownProps) => ({
  //numero: state.tareas.todos.length
  numero: state.tareas.total
});

export default connect(mapStateToProps)(total);