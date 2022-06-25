const path = require('path');

require('electron-reload')(
  [
    path.join(__dirname, "app"),
  ],
  {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    forceHardReset: true
  }
);

const { initApp } = require('./app');

initApp({
  isProduction: false,
  baseUrl: 'http://localhost:4200',
})
