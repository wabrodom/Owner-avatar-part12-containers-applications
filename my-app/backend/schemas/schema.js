const { makeExecutableSchema } = require("@graphql-tools/schema")
const { merge } = require('lodash')

const { typeDef: Director,resolvers: directorResolvers } =require('./director')
const { typeDef: Movie, resolvers: movieResolvers } =require('./movie')
const { typeDef: User, resolvers: userResolvers } = require('./user')

const typeDefs = `
  // type Director {
  //   name: String!
  //   born: Int
  //   movies: [Movie]
  //   movieCount: Int
  // }

  // type Movie {
  //   title: String!
  //   director: Director!
  //   released: Int!
  //   genres: [String!]!
  //   id: ID!
  // }

  // type User {
  //   username: String!
  //   favoriteGenre: String!
  //   id: ID!
  // }

  // type Token {
  //   value: String!
  // }

  type Query {
    // movieCount: Int!
    // directorCount: Int!
    // allMovies(director: String, genre: String): [Movie]!
    // allDirectors: [Director!]!
    // me: User
  }

  type Mutation {
    // addMovie(
    //   title: String!
    //   director: String!
    //   released: Int!
    //   genres: [String!]!
    // ): Movie!
    // editDirector(
    //   name: String!
    //   setBornTo: Int!
    // ): Director

    // createUser(
    //   username: String!
    //   favoriteGenre: String!
    // ): User

    // login(
    //   username: String!
    //   password: String!
    // ): Token

    clearMovie: Int!
    clearDirector: Int!
  }

  // type Subscription {
  //   movieAdded: Movie!
  // }

`
const Query = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`

const schema = makeExecutableSchema({
  typeDefs: [ Query, Director, Movie, User ],
  resolvers: merge(directorResolvers, movieResolvers, userResolvers)
})

module.exports = schema