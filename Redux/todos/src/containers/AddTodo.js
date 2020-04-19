import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

const AddTodo = ({ dispatch }) => {
  let componente_dom

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        console.log(process.env.NODE_ENV);
        if (!componente_dom.value.trim()) {
          return
        }
        dispatch(addTodo(componente_dom.value))
        componente_dom.value = ''
      }}>
        <input ref={node => componente_dom = node} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}

export default connect()(AddTodo)
