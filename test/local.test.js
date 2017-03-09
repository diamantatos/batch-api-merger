var chai = require('chai')
  , chaiHttp = require('chai-http')
  , express = require('express');
chai.use(chaiHttp);
var expect = chai.expect;

describe('localhost get rest api tests', function () {
  before(function () {
    app = express();
    require('../index')(app, 'http://localhost:3000/', '/api/resources');
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
  });

  describe('/GET users=api/users&customer=api/customers/23&countries=api/countries', () => {
    it('it should GET all users, customer with id 23 and all countries ', (done) => {
      chai.request(app)
      .get('/api/resources?users=api/users&customer=api/customers/23&countries=api/countries')
      .end((err, res) => {
          expect(res).to.be.ok;
          expect(res).to.have.status(200);
          expect(res.body.users[0].username).to.equal('hello');
          expect(res.body.users[1].name).to.equal('doe');
          expect(res.body.countries[0].countrie).to.equal('Greece');
          expect(res.body.countries[1].name).to.equal('Danmark');
          expect(res.body.customer.name).to.equal('world');
        done();
      });
    });
  });
});
