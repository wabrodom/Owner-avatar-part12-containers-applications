
const GenreDisplay = ( {books , setGenre} ) => {


  const allGenres = (books) => {
    const set = new Set()
    for (let book of books) {
      const currentGenres = book.genres
      set.add(...currentGenres)
    }
    return [...set]
  }

  const genres = allGenres(books)

  const selectGenre = (event) =>  setGenre( event.target.value )
  const clearGenre = () => setGenre(null)

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