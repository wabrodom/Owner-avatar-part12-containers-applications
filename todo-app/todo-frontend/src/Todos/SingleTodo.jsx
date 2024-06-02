const SingleTodo = ({ todo, onClickComplete, onClickDelete }) => {

  const doneInfo = (
    <>
      <span>This todo is done</span>
      <span>
        <button onClick={() => onClickDelete(todo)}> Delete </button>
      </span>
    </>
  )
  const notDoneInfo = (
    <>
      <span>
        This todo is not done
      </span>
      <span>
        <button onClick={() => onClickDelete(todo)}> Delete </button>
        <button onClick={() => onClickComplete(todo)}> Set as done </button>
      </span>
    </>
  )
  const singleTodoStyle = {
    display: 'flex', 
    justifyContent: 'space-between', 
    maxWidth: '70%', 
    margin: 'auto',
    borderBottom: '1px solid gray'
  }

  return (
    <div style={singleTodoStyle}>
      <span>
        {todo.text}
      </span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  )
}

export default SingleTodo