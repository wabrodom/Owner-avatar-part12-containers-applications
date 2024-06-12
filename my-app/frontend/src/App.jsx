import { 
  Routes, Route, Link,
  Navigate
} from 'react-router-dom'
import { useState } from 'react'
import LogIn from './components/LogIn/LogIn'
import Directors from './components/Directors'
import Movies from './components/Movies'
import NewMovie from './components/NewMovie'
import Notification from './components/Notification'

import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { ALL_MOVIES, MOVIE_ADDED } from './queries';
import Recommended from './components/Recommended';
import SignUp from './components/SignUp/SignUp';

const App = () => {
  const [errorMessage , setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const result = useQuery(ALL_MOVIES)

  useSubscription(MOVIE_ADDED, {
    onData: ( ({ data, client }) => {
      const addedMovie = data.data.movieAdded
      const title = data.data.movieAdded.title
      const director = data.data.movieAdded.director.name
      window.alert(`'${title}' by ${director} added`)

      client.cache.updateQuery({ query: ALL_MOVIES}, data => {
        return {
          allMovies: data.allMovies.concat(addedMovie)
        }
      })
    })
  })

  const notify  = message => {
    setErrorMessage(message)
    setTimeout(()=> {
      setErrorMessage('')
    }, 5000)
  }

  const logOut = () => {
    setToken(null)
    localStorage.removeItem('moviereveries-user-token')
    client.resetStore()
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const allMovies = result.data.allMovies

  const directorMap  = (movies) => {
    const map = new Map()
    for (let movie of movies) {
      const currentAuthor = movie.director.name
      const currentCount = map.get(currentAuthor) || 0
      map.set(currentAuthor, currentCount + 1)
    }
    return map
  }
  const getDirectorAndMovieCount =() => {
    const map = directorMap(allMovies)
    const directorsAndMovies = []
    for (let pair of map.entries()) {
      const currentAuthor = { name: pair[0], movieCount: pair[1] }
      directorsAndMovies.push(currentAuthor)
    }
    return directorsAndMovies
  }

  const directorAndMovieCount = getDirectorAndMovieCount()

  return (
      <div>
        <div>
          <Link to='/'>
            <button>
              directors
            </button>
          </Link>
    
          <Link to='/movies'>
            <button>
              movies
            </button>
          </Link>

          {token ? 
            <>
            <Link to='/recommended'>
              <button>
                recommended
              </button>
            </Link>
            <Link to='/add'>
              <button>
                add movie
              </button>
            </Link>
            <button onClick={logOut}>log out</button>
            </>
          :
            <>
            <Link to='/login'>
              <button> 
                log in
              </button>
            </Link>
            <Link to='/signup'>
              <button>
                sign up
              </button>
            </Link>
            </>
          }
        </div>

        
        <Routes>
          <Route path='/' 
            element={<Directors setError={notify} directorAndMovieCount={directorAndMovieCount}/>} 
          />

          <Route path='/movies' 
            element={<Movies/>}
          />

          <Route path='/add' 
            element={token ? <NewMovie setError={notify}/> : <Navigate replace to ='/login'/>} 
          />

          <Route path='/recommended' 
            element={token ? <Recommended/> : <Navigate replace to ='/login'/>} 
          />

          <Route path='/login' 
            element={token ? <Navigate replace to ='/add'/> : <LogIn setToken={setToken} setError={notify} /> } 
          />

          <Route path='/signup' 
            element={token ? <Navigate replace to ='/add'/> : <SignUp setToken={setToken} setError={notify} /> } 
          />


        </Routes>
        <Notification message={errorMessage}/>
      </div>

  )
}

export default App