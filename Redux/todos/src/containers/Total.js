import { connect } from 'react-redux'
import React from "react";

const total = ({ etiqueta, numero }) => (
  <h3>
    {etiqueta}: {numero}
  </h3>
);


const mapStateToProps = (state, ownProps) => ({
  //Sin undoable
  //numero: state.tareas.todos.length
  //numero: state.tareas.total

  //Con undoable
  numero: state.tareas.present.todos.length
  //numero: state.tareas.present.total,
});

export default connect(mapStateToProps)(total);