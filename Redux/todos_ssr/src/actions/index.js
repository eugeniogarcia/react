let nextTodoId = 0
export const addTodo = (tarea) => ({
         type: "ADD_TODO",
         id: nextTodoId++,
         tarea,
       });

export const setVisibilityFilter = (filtro) => ({
         type: "SET_VISIBILITY_FILTER",
         filtro,
       });

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
