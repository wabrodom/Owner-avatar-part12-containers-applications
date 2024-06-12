const Notification = ({ message }) => {
  const style = {color: 'red'}
  
  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification