import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_MOVIE, ALL_MOVIES, ALL_DIRECTORS } from '../queries'

const NewMovie = ({ setError }) => {
  const [title, setTitle] = useState('')
  const [director, setDirector] = useState('')
  const [released, setReleased] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ addMovie ]  = useMutation(ADD_MOVIE, {
    refetchQueries: [ { query: ALL_DIRECTORS, }],
    onError: (error) => {
      console.log(error)
      setError(error.graphQLErrors[0].message)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_MOVIES }, (data) => {
        return {
          allMovies: data.allMovies.concat(response.data.addMovie)
          // allMovies: allMovies.concat(response.data.addMovie) // destructure { allMovies }
        }
      })
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    addMovie( { variables: { 
      title, 
      director, 
      released: +released, 
      genres 
    } })

    setTitle('')
    setReleased('')
    setDirector('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          director
          <input
            value={director}
            onChange={({ target }) => setDirector(target.value)}
          />
        </div>
        <div>
          released
          <input
            type="number"
            value={released}
            onChange={({ target }) => setReleased(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(', ')}</div>
        <button type="submit">Add movie</button>
      </form>
    </div>
  )
}

export default NewMovie