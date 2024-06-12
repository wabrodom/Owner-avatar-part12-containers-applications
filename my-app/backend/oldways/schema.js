
const typeDefs = `
  type Director {
    name: String!
    born: Int
    movies: [Movie]
    movieCount: Int
  }

  type Movie {
    title: String!
    director: Director!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    movieCount: Int!
    directorCount: Int!
    allMovies(director: String, genre: String): [Movie]!
    allDirectors: [Director!]!
    me: User
  }

  type Mutation {
    addMovie(
      title: String!
      director: String!
      published: Int!
      genres: [String!]!
    ): Movie!
    editDirector(
      name: String!
      setBornTo: Int!
    ): Director

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

    clearMovie: Int!
    clearDirector: Int!
  }

  type Subscription {
    movieAdded: Movie!
  }

`

module.exports = typeDefs