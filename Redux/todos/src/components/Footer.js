import React from 'react'
import FilterLink from '../containers/FilterLink'
import { VisibilityFilters } from '../actions'
import Total from '../containers/Total'

//FilterLink conecta Redux y Filter. Lo que obtenemos es un Componente Link
//que esta conectado con Redux
//Estamos pasando la propiedad filter en el props del componente Link
const Footer = () => (
  <div>
    <span>Show: </span>
    <FilterLink filtro={VisibilityFilters.SHOW_ALL}>All</FilterLink>
    <FilterLink filtro={VisibilityFilters.SHOW_ACTIVE}>Active</FilterLink>
    <FilterLink filtro={VisibilityFilters.SHOW_COMPLETED}>Completed</FilterLink>
    <br/>
    <Total etiqueta="Total"/>
  </div>
);

export default Footer
