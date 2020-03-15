module.exports = {
  client: {
    service: {
      name: 'vuegraphql-testapp',
      // URL to the GraphQL API
      url: 'https://vuegraphql-testapp.herokuapp.com/v1/graphql',
    },
    // Files processed by the extension
    includes: [
      'src/**/*.vue',
      'src/**/*.js',
    ],
  },
};
