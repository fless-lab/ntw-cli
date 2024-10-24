export default {
    ...require('./app-structure-generator.js'),
    ...require('./messages.js'),
    ...require('./setup.js'),
    ...require('./config.js'),
    ...require('./application.js').default,
  };
  