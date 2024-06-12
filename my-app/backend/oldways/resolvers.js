const { GraphQLError } = require('graphql')
const jwt =require('jsonwebtoken')
const Director = require('./models/Director')
const Movie = require('./models/Movie')
const User = require('./models/User')
const config = require('./utils/config')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

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

    directorCount: async() => Director.collection.countDocuments(),

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

    allDirectors: async () => {
      const allThedirectors = await Director.aggregate([
        {  
          $project: {
            name: 1,
            born: 1,
            movies: 1,
            movieCount: {$size:"$movies"}
          } 
        }
      ])

      await Director.populate(allThedirectors, {path: 'movies'})
      return allThedirectors
    },

    me: (root, args, context) => {
      return context.currentUser
    }
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

        const movie = new Movie({ ...args, director: newDirector._id })

        try {
          await movie.save()
          newDirector.movies = newDirector.movies.concat(movie._id)
          await newDirector.save()
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
        await foundDirector.save()
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

      return populated
    },


    editDirector: async (root, args, { currentUser }) => {
      if ( !currentUser) { 
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      
      const directorToEdit = await Director.findOne( { name: args.name })
    
      if (!directorToEdit) {
        return null
      }
      // graphQL type defintion in Mutation is Int, it will check type first, if err below code will not run
      if (typeof args.setBornTo !== 'number') {
        throw new GraphQLError('the director birthyear must be a number', {
          extensions: {
            code: 'BAD_USER_INPUT',
            inValidArgs: args.setBornTo
          }
        })
      }

      directorToEdit.born = args.setBornTo
      try {
        await directorToEdit.save()
      } catch(error) {
        throw new GraphQLError('failed to change birthyear of the director', {
          extensions: {
            code: 'BAD_USER_INPUT',
            inValidArgs: args.setBornTo
          }
        })
      }

      return directorToEdit
    },

    createUser: async (root, args) => {
      const user = new User({ 
        username: args.username,
        favoriteGenre: args.favoriteGenre || 'self-help'
      })

      return user.save().catch(error => {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }

        })
      })

    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secretPassword') {
        throw new GraphQLError('wrong credentials' , {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const userForToken = { username: user.username, id: user._id}
      return { value: jwt.sign(userForToken, config.JWT_SECRET)}
    },
    clearMovie: async() => {
      await Movie.deleteMany({})
      return Movie.collection.countDocuments()
    },
    clearDirector: async() => {
      await Director.deleteMany({})
      return Director.collection.countDocuments()
    }
  },

  Subscription: {
    movieAdded: {
      subscribe: () => pubsub.asyncIterator('MOVIE_ADDED')
      // return AsyncIterator obj, its name is 'MOVIE_ADDED'. the job is to listen to "MOVIE_ADDED event label"
      // or it save info about client that do the  subscriptions
    }
  }
}

module.exports = resolvers