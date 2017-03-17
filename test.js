
var app = require('./batch-api-merger')('http://localhost:3000/', '/api/resources');

app.get('/api/users', function (req, res, next) {
  res.send([{username: 'hello', name: 'world'},{username: 'john', name: 'doe'}]);
})

app.get('/api/customers/23', function (req, res,next) {
  res.send({customer: 'hello', name: 'world'});
})


app.get('/api/countries', function (req, res,next) {
  res.send([{country: 'Greece', name: 'Hellas'},{country: 'Denmark', name: 'Danmark'}]);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
