var chai = require('chai')
, chaiHttp = require('chai-http')
, app = require('../batch-api-merger')('http://localhost:3000/', '/api/resources');
chai.use(chaiHttp);
var expect = chai.expect;

describe('localhost get rest api tests', function () {
  before(function () {
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

    })
  });

  describe('/GET users=api/users&customer=api/customers/23&countries=api/countries', () => {
    it('GETs all users, customer with id 23 and all countries ', (done) => {
      chai.request(app)
      .get('/api/resources?users=api/users&customer=api/customers/23&countries=api/countries')
      .end((err, res) => {
        expect(res).to.be.ok;
        expect(res).to.have.status(200);
        expect(res.body.users[0].username).to.equal('hello');
        expect(res.body.users[1].name).to.equal('doe');
        expect(res.body.countries[0].country).to.equal('Greece');
        expect(res.body.countries[1].name).to.equal('Danmark');
        expect(res.body.customer.name).to.equal('world');
        done();
      });
    });
    it('display error only on countries', (done) => {
      chai.request(app)
      .get('/api/resources?users=api/users&customer=api/customers/23&countries=api/countrie')
      .end((err, res) => {
        expect(res).to.be.ok;
        expect(res).to.have.status(200);
        expect(res.body.users[0].username).to.equal('hello');
        expect(res.body.users[1].name).to.equal('doe');
        expect(res.body.countries).to.equal('Error: Unable to get countries');
        expect(res.body.customer.name).to.equal('world');
        done();
      });
    });
  });
});
