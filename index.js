var async = require('async');
var request = require('request');

module.exports = function(app, root = 'http://localhost:3000/', apiEndpoint = '/api/resources'){
  function tryParseJSON(jsonString){
      try {
          var o = JSON.parse(jsonString);
          if (o && typeof o === "object") {
              return o;
          }
      }
      catch (e) { }
      return false;
  };

  app.get(apiEndpoint, function (req, res, next) {
    var properties = [];
    var reply = {};
    for (var property in req.query) {
      properties.push(property);
    }
    async.map(properties, function(property, callback) {
      request(root+req.query[property], function(error, response, body) {
        reply[property]=tryParseJSON(body);
        if (reply[property] === false){
          error=true;
        }
        callback(error, reply);
      });
    }, function(err, results) {
      if (!err) {
        res.send(reply);
      }
      else {
        res.send({error: 'Error, unable to get resources. Please Check your Query'})
      }
    });
  })
}
