import { useMutation } from "@apollo/client"
import { LOGIN } from "../../queries"
import LogInContainer from "./LogInContainer";
import PropTypes from 'prop-types';

const LogIn = ( { setToken, setError }) => {
  const [ login ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('moviereveries-user-token', token)
    }
  })


  const submit = async (values )  => {
    const { username, password } = values
    await login({ variables: { username, password } })
  }

  
  return (
    <div>
     <LogInContainer handleLogin={submit} />
    </div>
  )
}

export default LogIn

LogIn.propTypes = {
  setToken: PropTypes.func,
  setError: PropTypes.func
}

/*
// useEffect(() => {
//   if (result.data) {
//     const token = result.data.login.value
//     setToken(token)
//     localStorage.setItem('moviereveries-user-token', token)
//   }
// }, [result.data])
*/