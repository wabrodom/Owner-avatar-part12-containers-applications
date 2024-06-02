import SingleTodo from './SingleTodo';

const TodoList = ({ todos, deleteTodo, completeTodo }) => {

  return (
    <div>
      {todos.map(todo => {
        return (
          <SingleTodo
            key={todo._id}
            todo={todo}
            onClickComplete={() => completeTodo(todo)}
            onClickDelete={() => deleteTodo(todo)}
          />
        )
      })}
    </div>
  )
}

export default TodoList

// .reduce((acc, cur) => [...acc, <hr />, cur], [])
// need to make backend object return it instead of _id