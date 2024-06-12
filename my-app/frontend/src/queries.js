import { gql } from "@apollo/client"

const MOVIE_DETAILS = gql`
  fragment MovieDetails on Movie {
    title
    director {
      name
      born
    }
    released
    genres
    id
  }
`

export const LOGIN = gql`
  mutation($username: String!, $password: String!){
    login(username: $username, password: $password) {
      value
    }
  }
`

export const SIGNUP = gql`
  mutation CreateUser($username: String!, $name: String!, $favoriteGenre: String!, $password: String!) {
    createUser(username: $username, name: $name, favoriteGenre: $favoriteGenre, password: $password) {
      name
      passwordHash
      movies
      id
      favoriteGenre
      username
    }
  }
`

export const ALL_DIRECTORS = gql`
  query{
    allDirectors {
      name
      born
      movies {
        title
      }
      movieCount
    }
  }
`

export const ALL_MOVIES = gql`
  query allMovies($director: String, $genre: String) {
    allMovies(director: $director, genre: $genre) {
      title
      director {
        name
        born
      }
      genres
      released
      id
    }
  }
`

export const ALL_DIRECTOR_MOVIES = gql`
  query($director: String) {
    allMovies(director: $director) {
      title
      director {
        name
      }
      released
      genres
    }
  }
`

export const  ADD_MOVIE = gql`
mutation(
  $title: String!, 
  $director: String!, 
  $released: Int!, 
  $genres: [String!]!){
  addMovie(title: $title, director: $director, released: $released, genres: $genres) {
    title
    director {
      name
      born
    }
    released
    genres
    id
  }
}
`

export const EDIT_DIRECTOR = gql`
  mutation editDirector($name: String!, $setBornTo: Int!){
    editDirector(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

export const CURRENT_USER = gql`
  query {
    me {
      username
      id
      favoriteGenre
    }
  }
`

export const MOVIE_ADDED = gql`
  subscription {
    bookAdded {
      ...MovieDetails
    }
  }
  ${MOVIE_DETAILS}
`