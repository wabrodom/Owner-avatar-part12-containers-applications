const { GraphQLError } = require('graphql')
const Director = require('../models/Director')
const Movie = require('../models/Movie')
const User = require('../models/User')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const typeDef =`
  extend type Query {
    movieCount: Int!
    allMovies(director: String, genre: String): [Movie]!
  }

  extend type Mutation {
    addMovie(
      title: String!
      director: String!
      released: Int!
      genres: [String!]!
    ): Movie!
    clearMovie: Int!
  }

  extend type Subscription {
    movieAdded: Movie!
  }

  type Movie {
    title: String!
    director: Director!
    released: Int!
    genres: [String!]!
    id: ID!
  }

`

const resolvers = {
  Movie: {
    director: (root) => {
      return {
        name: root.director.name,
        born: root.director.born
      }
    }
  },
  
  Query: {
    movieCount: async () => Movie.collection.countDocuments(),
   
    allMovies: async (root, args) => {
      if (!args.director && !args.genre) {
        const allMoviesPopulated = await Movie.find({}).populate('director')
        return allMoviesPopulated
      }
      if (args.director && !args.genre) {
        const foundDirector = await Director.findOne({ name : args.director })
        const directorMovies = await Movie.find({ director : foundDirector._id }).populate('director')
        return directorMovies
      }
      if (!args.director && args.genre ) {
        const matchGenre = await Movie.find({ genres: args.genre }).populate('director')
        return matchGenre
      }

      const matchDirector = await Director.findOne({ name : args.director })
      const matchDirectorAndGenre = await Movie.find({ director : matchDirector._id })
        .find({ genres: args.genre }).populate('director')

      return matchDirectorAndGenre
    },

  },

  Mutation: {
    addMovie: async (root, args, { currentUser }) => {
      if ( !currentUser) { 
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const duplicatedName = await Movie.findOne({ title: args.title })

      if (duplicatedName) {
        throw new GraphQLError('movie name must be unqiue', {
          extensions: {
            code: 'BAD_USER_INPUT',
            inValidArgs: args.title
          }
        })
      }

      const foundDirector = await Director.findOne({ name: args.director })
      const postUser = await User.findById(currentUser._id)

      if ( !foundDirector ) {
        const newDirector = new Director({ name: args.director })
        try {
          await newDirector.save()
        } catch (error) {
          throw new GraphQLError('new director name saved failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              inValidArgs: args.director,
              error
            }
          })
        }

        const movie = new Movie({
           title: args.title,
           director: args.director,
           released: args.released,
           genres: args.genres,
           director: newDirector._id,
           user: currentUser._id
          })

        try {
          await movie.save()
          newDirector.movies = newDirector.movies.concat(movie._id)
          postUser.movies = postUser.movies.concat(movie._id)
          await newDirector.save()
          await postUser.save()
        } catch (error) {
          throw new GraphQLError('save movie failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              inValidArgs: args,
              error
            }
          })
        }

        const populated = await movie.populate('director')

        pubsub.publish('MOVIE_ADDED', { movieAdded: populated })

        return populated

      }

      const movie = new Movie({ ...args, director: foundDirector._id })

      try {
        await movie.save()
        foundDirector.movies = foundDirector.movies.concat(movie._id)
        postUser.movies = postUser.movies.concat(movie._id)
        await foundDirector.save()
        await postUser.save()
      } catch (error) {
        throw new GraphQLError('save movie falied, The movie name is at least 5 characters', {
          extensions: {
            code: 'BAD_USER_INPUT',
            inValidArgs: args,
            error
          }
        })
      }
      const populated = await movie.populate('director')
      // console.log('In the list author', populated)
      return populated
    },
    clearMovie: async() => {
      await Movie.deleteMany({})
      return Movie.collection.countDocuments()
    },
  },

  Subscription: {
    movieAdded: {
      subscribe: () => pubsub.asyncIterator('MOVIE_ADDED')
      // return AsyncIterator obj, its name is 'MOVIE_ADDED'. the job is to listen to "MOVIE_ADDED event label"
      // or it save info about client that do the  subscriptions
    }
  }

}

module.exports = { typeDef, resolvers }