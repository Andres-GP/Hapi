const Hapi = require('@hapi/hapi');
const path = require('path');
const inert = require('inert');

//database
require('./database');
const User = require('./models/users')

const init = async () => {
  const server = new Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'public')
      }
    }
  });

  await server.register(inert);
  await server.register(require('@hapi/vision'))

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates',
    isCached: process.env.NODE_ENV === 'production'
  });

  await server.start();
  console.log('Server running on:', server.info.uri);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return '<h1>hello World!</h1>';
    }
  });

  server.route({
    method: 'GET',
    path: '/about',
    handler: (request, h) => {
      return 'ABOUT';
    }
  });

  server.route({
    method: 'GET',
    path: '/hello/{user}',
    handler: (request, h) => {
      return `
        <h1>Hello ${request.params.user}</h1>
        <p>Lorem Ipsum</p>
      `;
    }
  });

  server.route({
    method: 'GET',
    path: '/text.txt',
    handler: (request, h) => {
      return h.file('./text.txt')
    }
  });

  server.route({
    method: 'GET',
    path: '/page',
    handler: (request, h) => {
      return h.view('index')
    }
  });

  server.route({
    method: 'GET',
    path: '/name',
    handler: (request, h) => {
      return h.view('name', {
        name: 'pedro'
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/products',
    handler: (request, h) => {
      return h.view('products', {
        products: [
          {name: 'laptop'},
          {name: 'mouse'},
          {name: 'keyboard'},
          {name: 'mouse'},
          {name: 'monitor'},
        ]
      })
    }
  });

  server.route({
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
      const users = await User.find();
      return h.view('users', {
        users
      })
    }
  });

  server.route({
    method: 'POST',
    path: '/users',
    handler: async (request, h) => {
      const newuser = new User({username: request.payload.username});
      await newuser.save()
      return h.redirect().location('users')
    }
  });

};

init();