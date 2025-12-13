// config/routes.js
module.exports.routes = {
  // ... other routes
  'GET /hello': { controller: 'Hello', action: 'world' },
  // Or for standalone actions:
  'GET /hello-world': 'hello/world'
};
