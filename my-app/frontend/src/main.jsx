import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { 
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client'

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'


import { setContext } from '@apollo/client/link/context'
import { 
  BrowserRouter as Router} from "react-router-dom"

const authLink = setContext((request, previousContext) => {
  const token = localStorage.getItem('moviereveries-user-token')
  return {
    headers: {
      ...previousContext.headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const httpLink = createHttpLink({ uri: import.meta.env.VITE_BACKEND_URL })

const wsLink = new GraphQLWsLink(createClient({ url: import.meta.env.VITE_GRAPHQLWSLINK }))

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>
)