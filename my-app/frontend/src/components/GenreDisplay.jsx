import { ALL_MOVIES } from "../queries"
import { useQuery } from "@apollo/client"


const GenreDisplay = ( { setGenre, refetch } ) => {
  const result = useQuery(ALL_MOVIES)

  if (result.loading) {
    return <div>loading...</div>
  }

  const allMovies = result.data.allMovies

  const allGenresHelper = (movies) => {
    const set = new Set()
    for (let movie of movies) {
      const currentGenres = movie.genres
      if (Array.isArray(currentGenres)){
        currentGenres.forEach(elem => set.add(elem))
      } else {
        set.add(...currentGenres)
      }
    }
    return [...set]
  }

  const genres = allGenresHelper(allMovies)

  const selectGenre = (event) => { 
    setGenre(event.target.value)
    result.refetch()
  }
  const clearGenre = () => {
    setGenre(null)
    refetch()
  }
  const colorSalmon = { backgroundColor: 'salmon'}

  return (
    <div>
      Genres
      {genres.map(genre => 
        <button onClick={selectGenre} value={genre} key={genre}>
          {genre}
        </button>
      )}
      <button onClick={clearGenre} style={colorSalmon}>clear filter</button>
    </div>
  )

}

export default GenreDisplay