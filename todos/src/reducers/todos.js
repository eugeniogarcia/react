const tareas = (estado = {todos:[],total:0}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        todos: [
          ...estado.todos,
          {
            id: action.id,
            text: action.tarea,
            completed: false,
          },
        ],
        total: estado.total + 1};
    case 'TOGGLE_TODO':
      return {
        todos: estado.todos.map((todo) =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        ),
        total: estado.total,
      };
    default:
      return estado;
  }
};

export default tareas;
