import * as chai from 'chai';
import supertest from 'supertest';
import app from '../server.js';
import Product from '../models/Products.js';
import mongoose from 'mongoose';

const { expect } = chai;
const request = supertest(app);

describe('Product Controller Tests', () => {
  describe('POST /create-product', () => {
    let createdProductId;

    it('should create a new product and return 201', (done) => {
      // Add a unique suffix to the product name
      const uniqueSuffix = Date.now();
      const productData = { name: `Unique Test8 Product ${uniqueSuffix}`, quantity: 10, category: 'Electronics' };

      request
        .post('/create-product')
        .send(productData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          createdProductId = res.body._id;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name', productData.name);
          expect(res.body).to.have.property('quantity', productData.quantity);
          expect(res.body).to.have.property('category', productData.category);
          done();
        });
    });

    it('should return 400 if the product already exists', (done) => {
      const productData = { name: 'Product 1', quantity: 10, category: 'Electronics' };

      // First, create the product
      request
        .post('/create-product')
        .send(productData)
        .end((err, res) => {
          if (err) return done(err);

          request
            .post('/create-product')
            .send(productData)
            .expect(400)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message', 'Product already exists');
              done();
            });
        });
    });

    it('should return 400 if the quantity is negative', (done) => {
      const productData = { name: 'Negative Quantity Product', quantity: -10, category: 'Electronics' };

      request
        .post('/create-product')
        .send(productData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Quantity cannot be negative');
          done();
        });
    });

    after(async () => {
      // Clean up the created product after tests
      if (createdProductId) {
        await Product.findByIdAndDelete(createdProductId);
      }
    });
  });

  describe('GET /get-product/:id', () => {
    let createdProductId;

    before(async () => {
      // Insert a test product
      const productData = { name: 'Test Product', quantity: 10, category: 'Electronics' };
      const product = new Product(productData);
      await product.save();
      createdProductId = product._id;
    });

    it('should retrieve a product by its ID and return 200', (done) => {
      request
        .get(`/get-product/${createdProductId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name', 'Test Product');
          expect(res.body).to.have.property('quantity', 10);
          expect(res.body).to.have.property('category', 'Electronics');
          done();
        });
    });

    it('should return 404 if the product does not exist', (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();
      request
        .get(`/get-product/${nonExistentId}`)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Product not found');
          done();
        });
    });

    it('should return 400 if the ID is invalid', (done) => {
      const invalidId = 'invalid-id';
      request
        .get(`/get-product/${invalidId}`)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Invalid ID format');
          done();
        });
    });

    after(async () => {
      // Clean up the created product after tests
      if (createdProductId) {
        await Product.findByIdAndDelete(createdProductId);
      }
    });
  });

  describe('PUT /update-product/:id', () => {
    let createdProductId;

    before(async () => {
      // Insert a test product
      const productData = { name: 'Test Product', quantity: 10, category: 'Electronics' };
      const product = new Product(productData);
      await product.save();
      createdProductId = product._id;
    });

    it('should update a product and return 200', (done) => {
      const updateData = { quantity: 20 };
      request
        .put(`/update-product/${createdProductId}`)
        .send(updateData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('quantity', 20);
          done();
        });
    });

    it('should return 404 if the product does not exist', (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = { quantity: 20 };
      request
        .put(`/update-product/${nonExistentId}`)
        .send(updateData)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Product not found');
          done();
        });
    });

    it('should return 400 if the ID is invalid', (done) => {
      const invalidId = 'invalid-id';
      const updateData = { quantity: 20 };
      request
        .put(`/update-product/${invalidId}`)
        .send(updateData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Invalid ID format');
          done();
        });
    });

    it('should return 400 if the quantity is negative', (done) => {
      const updateData = { quantity: -10 };
      request
        .put(`/update-product/${createdProductId}`)
        .send(updateData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Quantity cannot be negative');
          done();
        });
    });

    after(async () => {
      // Clean up the created product after tests
      if (createdProductId) {
        await Product.findByIdAndDelete(createdProductId);
      }
    });
  });

  describe('DELETE /delete-product/:id', () => {
    let createdProductId;
    let createdProductWithQuantityId;
  
    before(async () => {
      // Insert a test product with quantity 0
      const productData = { name: 'Test Product', quantity: 0, category: 'Electronics' };
      const product = new Product(productData);
      await product.save();
      createdProductId = product._id;
  
      // Insert a test product with quantity greater than 0
      const productWithQuantityData = { name: 'Test Product with Quantity', quantity: 10, category: 'Electronics' };
      const productWithQuantity = new Product(productWithQuantityData);
      await productWithQuantity.save();
      createdProductWithQuantityId = productWithQuantity._id;
    });
  
    it('should delete a product and return 201', (done) => {
      request
        .delete(`/delete-product/${createdProductId}`)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Product deleted successfully');
          done();
        });
    });
  
    it('should return 404 if the product does not exist', (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();
      request
        .delete(`/delete-product/${nonExistentId}`)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Product not found');
          done();
        });
    });
  
    it('should return 400 if the ID is invalid', (done) => {
      const invalidId = 'invalid-id';
      request
        .delete(`/delete-product/${invalidId}`)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Invalid ID format');
          done();
        });
    });
  
    it('should return 400 if the product quantity is greater than zero', (done) => {
      request
        .delete(`/delete-product/${createdProductWithQuantityId}`)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Product can not be deleted its quantity is greater than zero');
          done();
        });
    });
  
    after(async () => {
      // Clean up the created products after tests
      if (createdProductId) {
        await Product.findByIdAndDelete(createdProductId);
      }
      if (createdProductWithQuantityId) {
        await Product.findByIdAndDelete(createdProductWithQuantityId);
      }
    });
  });

  describe('GET /get-products', () => {
    before(async () => {
      // Clear the database before running tests
      await Product.deleteMany({});

      // Insert some test products
      const products = [
        { name: 'Product 1', quantity: 10, category: 'Electronics' },
        { name: 'Product 2', quantity: 20, category: 'Electronics' },
        { name: 'Product 3', quantity: 30, category: 'Electronics' },
        { name: 'Product 4', quantity: 40, category: 'Electronics' },
        { name: 'Product 5', quantity: 50, category: 'Electronics' },
        { name: 'Product 6', quantity: 60, category: 'Electronics' },
        { name: 'Product 7', quantity: 70, category: 'Electronics' },
        { name: 'Product 8', quantity: 80, category: 'Electronics' },
        { name: 'Product 9', quantity: 90, category: 'Electronics' },
        { name: 'Product 10', quantity: 100, category: 'Electronics' },
        { name: 'Product 11', quantity: 110, category: 'Electronics' },
      ];

      await Product.insertMany(products);
    });

    it('should retrieve products with default pagination values', (done) => {
      request
        .get('/get-products')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('page', 1);
          expect(res.body).to.have.property('totalPages', 2);
          expect(res.body).to.have.property('totalCount', 11);
          expect(res.body).to.have.property('data').that.is.an('array').with.lengthOf(10);
          done();
        });
    });

    it('should retrieve products with specified pagination values', (done) => {
      request
        .get('/get-products?page=2&limit=5')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('page', 2);
          expect(res.body).to.have.property('totalPages', 3);
          expect(res.body).to.have.property('totalCount', 11);
          expect(res.body).to.have.property('data').that.is.an('array').with.lengthOf(5);
          done();
        });
    });

    it('should handle invalid pagination values', (done) => {
      request
        .get('/get-products?page=-1&limit=-5')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('page', 1); // Default to page 1
          expect(res.body).to.have.property('totalPages', 2);
          expect(res.body).to.have.property('totalCount', 11);
          expect(res.body).to.have.property('data').that.is.an('array').with.lengthOf(10);
          done();
        });
    });

    after(async () => {
      // Clean up the test products after tests
      await Product.deleteMany({});
    });
  });
});