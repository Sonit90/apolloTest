import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import AuthPlugin from 'src/plugins/auth';


export default ({ app, Vue }) => {
  // Vue.use(AuthPlugin);
  Vue.use(VueApollo);

  // const getHeaders = () => {
  //   const headers = {};
  //   const token = window.localStorage.getItem('apollo-token');
  //   if (token) {
  //     headers.authorization = `Bearer ${token}`;
  //   }
  //   return headers;
  // };

  const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: 'https://vuegraphql-testapp.herokuapp.com/v1/graphql',
  });

  // Create the subscription websocket link
  const wsLink = new WebSocketLink({
    uri: 'ws://vuegraphql-testapp.herokuapp.com/v1/graphql',
    options: {
      reconnect: true,
      timeout: 30000,
    },
  });
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition'
        && definition.operation === 'subscription';
    },
    wsLink,
    httpLink,
  );
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      addTypename: true,
    }),
  });

  const apolloProvider = new VueApollo({
    defaultClient: client,
  });

  app.apolloProvider = apolloProvider;
};
