var express = require('express');
app = express();
var fetch = require('isomorphic-fetch');

var reflectFetches = function(promise) {
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
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) {
      throw new Error(`error: unable to get resource`);
    }
};

module.exports = function(root = 'http://localhost:3000/', apiEndpoint = '/api/resources'){
  app.get(apiEndpoint, function (req, res, next) {
    var promises = [];
    var reply = {};
    for (var property in req.query) {
      promises.push({fetch: fetch(root+req.query[property]), property: property });
    }
    res.writeHead(200, {'Content-Type': 'application/json'});

    Promise.all(promises.map(reflectFetches)).then(values => {
      let reply = {};
      values.map(function(value) {
        reply[value.property] = value.data;
      });
      let json = JSON.stringify(reply);
      json = json.replace(/\"([^(\")"]+)\":/g,"$1:");

      //console.log(values);
      res.write(JSON.stringify(reply));
    }).then(function() {
      //res.write('}');
      res.end();
    });

  })
  return app;
}
