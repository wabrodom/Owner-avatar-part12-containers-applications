const { GraphQLError } = require('graphql')
// const { gql } = require('apollo/server')
const jwt =require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const config = require('../utils/config')

const typeDef = `
  extend type Query {
    me: User
    allUser: [ExposableUser]!
  }

  extend type Mutation { 
    createUser(
      username: String!
      name: String!
      favoriteGenre: String!
      password: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

    clearUser: Int!
  }

  interface BasedUser {
    name: String
    favoriteGenre: String!
  }

  type ExposableUser implements BasedUser {
    name: String
    favoriteGenre: String!
  }

  type User implements BasedUser {
    username: String!
    name: String
    favoriteGenre: String!
    passwordHash: String!
    movies: [String]!
    id: ID!
  }

  type Token {
    value: String!
  }
`

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    allUser: async () => {
      const users =  await User.find({}, {
        name: 1,
        favoriteGenre:1,
      })
      return users
    }
  },

  Mutation: {
    createUser: async (root, args) => {
      const password = args.password
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({ 
        username: args.username,
        name: args.username,
        favoriteGenre: args.favoriteGenre || 'mystery',
        passwordHash: passwordHash,
        movies: [],
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

      if (!user) {
        throw new GraphQLError('User not found' , {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const passwordCorrect = await bcrypt.compare(args.password, user.passwordHash)
      if (!passwordCorrect) {
        throw new GraphQLError('wrong credentials' , {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const userForToken = { username: user.username, id: user._id}
      return { value: jwt.sign(userForToken, config.JWT_SECRET)}
    },
    clearUser: async() => {
      await User.deleteMany({})
      return User.collection.countDocuments()
    },
  }

}

module.exports = { typeDef,  resolvers }