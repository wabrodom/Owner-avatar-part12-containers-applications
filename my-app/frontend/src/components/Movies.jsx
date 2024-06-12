import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_MOVIES } from '../queries'
import GenreDisplay from './GenreDisplay'


const Movies = () => {
  const [genre, setGenre] = useState(null)

  const resultFilter = useQuery(ALL_MOVIES, {
    variables: { genre }, 
  })

  if (resultFilter.loading) {
    return <div>loading...</div>
  }

  const allMoviesFiltered = resultFilter.data.allMovies

  const triggerRefetch = () =>  resultFilter.refetch()

  return (
    <div>
      <h2>movies</h2>
      <GenreDisplay setGenre={setGenre} refetch={triggerRefetch} />
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>director</th>
            <th>released</th> 
          </tr>
          {allMoviesFiltered.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.director.name}</td>
              <td>{movie.released}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Movies