import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';
import Vehicle from '../../src/models/vehicleModel.js';
import Purchase from '../../src/models/purchaseModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

let mongoServer;
let request;

// Generate test tokens
const adminId = new mongoose.Types.ObjectId();
const adminToken = jwt.sign(
  { id: adminId, email: 'admin@test.com', role: 'admin' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const customerId = new mongoose.Types.ObjectId();
const customerToken = jwt.sign(
  { id: customerId, email: 'customer@test.com', role: 'customer' },
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
  await Purchase.deleteMany({});
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

// ─── POST /api/vehicles/:id/purchase (Standard JWT) ─────────────────────────

describe('POST /api/vehicles/:id/purchase', () => {
  it('should decrease vehicle quantity by 1 upon successful purchase for authenticated user', async () => {
    const vehicle = await seedVehicle({ quantity: 5 });

    const res = await request
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quantity).toBe(4);

    const updatedVehicle = await Vehicle.findById(vehicle._id);
    expect(updatedVehicle.quantity).toBe(4);

    const purchase = await Purchase.findOne({ user: customerId, vehicle: vehicle._id });
    expect(purchase).toBeTruthy();
    expect(purchase.pricePaid).toBe(25000); // Price from seedVehicle
  });

  it('should return 400 Bad Request when attempting to purchase a vehicle with quantity === 0', async () => {
    const vehicle = await seedVehicle({ quantity: 0 });

    const res = await request
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/out of stock|insufficient|quantity/i);

    const checkVehicle = await Vehicle.findById(vehicle._id);
    expect(checkVehicle.quantity).toBe(0);
  });

  it('should return 401 Unauthorized when no authentication token is provided', async () => {
    const vehicle = await seedVehicle({ quantity: 5 });

    const res = await request.post(`/api/vehicles/${vehicle._id}/purchase`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 Not Found when attempting to purchase a non-existent vehicle', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request
      .post(`/api/vehicles/${fakeId}/purchase`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ─── POST /api/vehicles/:id/restock (Admin JWT) ──────────────────────────────

describe('POST /api/vehicles/:id/restock', () => {
  it('should increase vehicle quantity upon successful restock by admin', async () => {
    const vehicle = await seedVehicle({ quantity: 2 });

    const res = await request
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quantity).toBe(7);

    const updatedVehicle = await Vehicle.findById(vehicle._id);
    expect(updatedVehicle.quantity).toBe(7);
  });

  it('should return 403 Forbidden when a customer tries to restock', async () => {
    const vehicle = await seedVehicle({ quantity: 2 });

    const res = await request
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 Unauthorized when no authentication token is provided', async () => {
    const vehicle = await seedVehicle({ quantity: 2 });

    const res = await request
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .send({ quantity: 5 });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
