const { initApp } = require('./app');

// Development
initApp({
  isProduction: false,
  baseUrl: 'http://localhost:4200',
});

// Production
// initApp({ 
//   isProduction: true,
//   baseUrl: 'dist/index.html',
// });
