import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"
import { SIGNUP } from "../queries"


/* 
  "username": "bombom",
  "name": "bom",  
  "favoriteGenre": "mystery",
  "password": "123456"
*/


const SignUp = ( { setError }) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [favoriteGenre, setFavoriteGenre] = useState([])
  const [password, setPassword] = useState('')

  const [signup, result] = useMutation(SIGNUP, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  // useEffect(() => {
  //   if (result.data) {
  //     const token = result.data.signup.value
  //     setToken(token)
  //     localStorage.setItem('library-user-token', token)
  //   }
  // }, [result.data])

  const submit = async event => {
    event.preventDefault()
    signup({ variables: { username, password, name, favoriteGenre} })

    setName('')
    setUsername('')
    setPassword('')
    setFavoriteGenre([])
  }

  
  return (
    <div>
      <form onSubmit={submit}>

      <div>
        username
        <input 
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>

      <div>
        name
        <input 
          type="text"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </div>

      <div>
        password
        <input 
         type="password"
         value={password}
         onChange={({ target }) => setPassword(target.value)}
        />
      </div>

      <div>
        favoriteGenre
        <input 
         type="favoriteGenre"
         value={favoriteGenre}
         onChange={({ target }) => setFavoriteGenre([target.value])}
        />
      </div>

      <button type='submit'>signup</button>

      </form>
    </div>
  )
}

export default SignUp