# batch-api-merger
Batch Api Merger
===========

A module that gets a single REST api request containing multiple REST api endpoints, gathers the reply of each one and sends back to the client a complete answer.

# Server Example

``````````
app = express();
require('batch-api-merger')(app, 'http://localhost:3000/', '/api/resources');

app.get('/api/users', function (req, res, next) {
  res.send([{username: 'hello', name: 'world'},{username: 'john', name: 'doe'}]);
})

app.get('/api/customers/23', function (req, res,next) {
  res.send({customer: 'hello', name: 'world'});
})

app.get('/api/countries', function (req, res,next) {
  res.send([{countrie: 'Greece', name: 'Hellas'},{countrie: 'Denmark', name: 'Danmark'}]);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
``````````

# Http Call Example

http://localhost:3000/api/resources?users=api/users&customer=api/customers/23&countries=api/countries

will give back

{"users":[{"username":"hello","name":"world"},{"username":"john","name":"doe"}],"customer":{"customer":"hello","name":"world"},"countries":[{"countrie":"Greece","name":"Hellas"},{"countrie":"Denmark","name":"Danmark"}]}

# License

MIT
