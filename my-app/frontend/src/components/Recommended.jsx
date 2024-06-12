import { useState } from "react"
import { useQuery, useLazyQuery } from "@apollo/client"
import { ALL_MOVIES, CURRENT_USER } from "../queries"

const Recommended = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [filteredMovies, setFilteredBooks] = useState(null)
  
  useQuery(CURRENT_USER, {
    onCompleted: (data) => {
      setCurrentUser(data.me)
      getFilterMovies({ variables: { genre: data.me.favoriteGenre }})
    }
  })

  const [getFilterMovies, resultFilterMovies] = useLazyQuery(ALL_MOVIES, {
    onCompleted: (data) => setFilteredBooks(data.allMovies)
  })


  if (resultFilterMovies.loading || !currentUser || !filteredMovies) {
    return null
  } 

  resultFilterMovies.refetch()

  return (
    <div>
      <h2>Recommendations</h2>
      <p>movies in your favorite genre: <strong>{currentUser.favoriteGenre}</strong> </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>director</th>
            <th>published</th>
          </tr>
          {filteredMovies.map(movie => {
            return (
              <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{movie.director.name}</td>
                <td>{movie.published}</td>
              </tr>
            )
          })}
       


        </tbody>
      </table>
    </div>
  )
}

export default Recommended