var express = require('express');
var fetch = require('isomorphic-fetch');
let app = express();

let reflectFetches = function(promise) {
  return promise.fetch
  .then(data => {
    return {property: promise.property, data: tryParseJSON(data.body.read()), status: "resolved"}
  })
  .catch(error => {
    return {property: promise.property, data: `Error: Unable to get ${promise.property}`, status: "rejected"}
  });
}

function tryParseJSON(jsonString){
  try {
    let o = JSON.parse(jsonString);
    return o;
  }
  catch (e) {
    throw new Error(`error: unable to get resource`);
  }
};

module.exports = function(root = 'http://localhost:3000/', apiEndpoint = '/api/resources'){
  app.get(apiEndpoint, function (req, res, next) {
    let promises = [];
    for (let property in req.query) {
      promises.push({fetch: fetch(root+req.query[property]), property: property });
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    Promise.all(promises.map(reflectFetches)).then(values => {
      let reply = {};
      values.map(function(value) {
        reply[value.property] = value.data;
      });
      res.write(JSON.stringify(reply));
    }).then(function() {
      res.end();
    });

  })
  return app;
}
