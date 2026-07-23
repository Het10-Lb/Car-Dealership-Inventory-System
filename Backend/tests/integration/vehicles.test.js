import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../src/app.js';
import Vehicle from '../../src/models/vehicleModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

let mongoServer;
let request;

// Generate test tokens
const adminToken = jwt.sign(
  { id: new mongoose.Types.ObjectId(), email: 'admin@test.com', role: 'admin' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const customerToken = jwt.sign(
  { id: new mongoose.Types.ObjectId(), email: 'customer@test.com', role: 'customer' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  request = supertest(app);
});

afterEach(async () => {
  await Vehicle.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Helper to seed a vehicle directly in DB
const seedVehicle = (overrides = {}) =>
  Vehicle.create({
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
    ...overrides,
  });

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────

describe('Auth Middleware', () => {
  it('should return 401 when no token is provided', async () => {
    const res = await request.get('/api/vehicles');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/token/i);
  });

  it('should return 401 when an invalid token is provided', async () => {
    const res = await request
      .get('/api/vehicles')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ─── GET /api/vehicles ───────────────────────────────────────────────────────

describe('GET /api/vehicles', () => {
  it('should return an empty array when no vehicles exist', async () => {
    const res = await request
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it('should return all vehicles for any authenticated user', async () => {
    await seedVehicle();
    await seedVehicle({ make: 'Honda', model: 'Civic', price: 22000 });

    const res = await request
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });
});

// ─── GET /api/vehicles/search ────────────────────────────────────────────────

describe('GET /api/vehicles/search', () => {
  beforeEach(async () => {
    await Vehicle.insertMany([
      { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 3 },
      { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 30000, quantity: 2 },
      { make: 'Ford', model: 'F-150', category: 'Truck', price: 45000, quantity: 1 },
    ]);
  });

  it('should filter by make', async () => {
    const res = await request
      .get('/api/vehicles/search?make=Toyota')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    res.body.data.forEach((v) => expect(v.make).toBe('Toyota'));
  });

  it('should filter by category', async () => {
    const res = await request
      .get('/api/vehicles/search?category=SUV')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].model).toBe('RAV4');
  });

  it('should filter by price range (minPrice & maxPrice)', async () => {
    const res = await request
      .get('/api/vehicles/search?minPrice=26000&maxPrice=40000')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].model).toBe('RAV4');
  });

  it('should return all vehicles when no filters are provided', async () => {
    const res = await request
      .get('/api/vehicles/search')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
  });
});

// ─── POST /api/vehicles (Admin only) ────────────────────────────────────────

describe('POST /api/vehicles', () => {
  const newVehicle = {
    make: 'Tesla',
    model: 'Model 3',
    category: 'Sedan',
    price: 40000,
    quantity: 10,
    imageUrl: 'https://example.com/tesla.jpg'
  };

  it('should allow admin to create a vehicle and return 201', async () => {
    const res = await request
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newVehicle);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('make', 'Tesla');
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data).toHaveProperty('imageUrl', 'https://example.com/tesla.jpg');
  });

  it('should return 403 when a customer tries to create a vehicle', async () => {
    const res = await request
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(newVehicle);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/admin/i);
  });

  it('should return 400 when required fields are missing', async () => {
    const res = await request
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Tesla' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should default quantity to 0 when not provided', async () => {
    const res = await request
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'BMW', model: 'X5', category: 'SUV', price: 60000 });

    expect(res.status).toBe(201);
    expect(res.body.data.quantity).toBe(0);
  });
});

// ─── PUT /api/vehicles/:id (Admin only) ──────────────────────────────────────

describe('PUT /api/vehicles/:id', () => {
  it('should allow admin to update a vehicle', async () => {
    const vehicle = await seedVehicle();

    const res = await request
      .put(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 28000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.price).toBe(28000);
  });

  it('should return 403 when a customer tries to update', async () => {
    const vehicle = await seedVehicle();

    const res = await request
      .put(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ price: 28000 });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 for non-existent vehicle ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request
      .put(`/api/vehicles/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 28000 });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ─── DELETE /api/vehicles/:id (Admin only) ───────────────────────────────────

describe('DELETE /api/vehicles/:id', () => {
  it('should allow admin to delete a vehicle', async () => {
    const vehicle = await seedVehicle();

    const res = await request
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it's gone
    const found = await Vehicle.findById(vehicle._id);
    expect(found).toBeNull();
  });

  it('should return 403 when a customer tries to delete', async () => {
    const vehicle = await seedVehicle();

    const res = await request
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 for non-existent vehicle ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request
      .delete(`/api/vehicles/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
