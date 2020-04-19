import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'

const TodoList = ({ mistodos, toggleTodo }) => (
  <ul>
    {mistodos.map((todo) => (
      <Todo key={todo.id} {...todo} onClick={() => toggleTodo(todo.id)} />
    ))}
  </ul>
);

TodoList.propTypes = {
  mistodos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  toggleTodo: PropTypes.func.isRequired,
};

export default TodoList
