const express = require ('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware')


const routes = {
    '/users':'http://localhost:3003/api/v1/users/',
    '/doctors':'http://localhost:3004/api/v1/doctors/',
    '/appointments':'http://localhost:3005/api/v1/appointments/',
    '/pharmacies':'http://localhost:3006/api/v1/pharmacies/',
 }

 for(const route in routes){
    const target = routes[route];
    app.use(route,createProxyMiddleware({target}))
}

app.listen(3008, () => console.log('Listening on port 3009'));

module.exports = app;