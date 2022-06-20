const { initApp } = require('./app');

initApp({ 
  isProduction: true,
  baseUrl: 'dist/emetsy/index.js',
});
