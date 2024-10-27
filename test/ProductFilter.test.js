import * as chai from 'chai';
import supertest from 'supertest';
import app from '../server.js';
import Product from '../models/Products.js';

const { expect } = chai;
const request = supertest(app);

describe('ProductController', () => {
    describe('GET /products/filter', () => {
        before(async () => {
          // Insert some test products into the database
          await Product.insertMany([
            { name: 'Laptop', category: 'Electronics', quantity: 5 },
            { name: 'Smartphone', category: 'Electronics', quantity: 15 },
            { name: 'Book', category: 'Books', quantity: 10 },
            { name: 'Another Laptop', category: 'Electronics', quantity: 3 },
          ]);
        });
    
        it('should filter products by category and quantity', (done) => {
          const filters = { category: 'Electronics', quantity: 10 };
    
          request
            .get('/products/filter')
            .query(filters)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.lengthOf(2);
              expect(res.body[0]).to.have.property('category', 'Electronics');
              expect(res.body[1]).to.have.property('category', 'Electronics');
              done();
            });
        });
    
        it('should filter products by category only', (done) => {
          const filters = { category: 'Electronics' };
    
          request
            .get('/products/filter')
            .query(filters)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.lengthOf(3);
              expect(res.body[0]).to.have.property('category', 'Electronics');
              expect(res.body[1]).to.have.property('category', 'Electronics');
              expect(res.body[2]).to.have.property('category', 'Electronics');
              done();
            });
        });
    
        it('should filter products by quantity only', (done) => {
          const filters = { quantity: 10 };
    
          request
            .get('/products/filter')
            .query(filters)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.lengthOf(2);
              expect(res.body[0]).to.have.property('quantity').that.is.below(10);
              expect(res.body[1]).to.have.property('quantity').that.is.below(10);
              done();
            });
        });
      });
});