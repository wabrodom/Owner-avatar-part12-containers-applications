const { GraphQLError } = require('graphql')
const Director = require('../models/Director')

const typeDef = `
  extend type Query {
    directorCount: Int!
    allDirectors: [Director!]!
  }

  extend type Mutation {
    editDirector(
      name: String!
      setBornTo: Int!
    ): Director
 
    clearDirector: Int!
  }

  type Director {
    name: String!
    born: Int
    movies: [Movie]
    movieCount: Int
  }
`

const resolvers ={
  Query: {
    directorCount: async() => Director.collection.countDocuments(),
  
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

  },
  Mutation: {
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

    clearDirector: async() => {
      await Director.deleteMany({})
      return Director.collection.countDocuments()
    }
  }
}

module.exports = { typeDef, resolvers }