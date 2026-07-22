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

// Helper to seed a vehicle and purchase directly in DB
const seedPurchase = async (userId, overrides = {}) => {
  const vehicle = await Vehicle.create({
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
  });

  return Purchase.create({
    user: userId,
    vehicle: vehicle._id,
    pricePaid: vehicle.price,
    ...overrides,
  });
};

describe('GET /api/purchases/my-history', () => {
  it('should return a list of purchases for the authenticated user', async () => {
    // Seed purchases for the customer and for someone else
    await seedPurchase(customerId);
    await seedPurchase(customerId);
    const otherUserId = new mongoose.Types.ObjectId();
    await seedPurchase(otherUserId);

    const res = await request
      .get('/api/purchases/my-history')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(2);
    // Ensure the populated vehicle data exists
    expect(res.body.data[0]).toHaveProperty('vehicle');
    expect(res.body.data[0].vehicle).toHaveProperty('make', 'Toyota');
  });

  it('should return 401 Unauthorized when no token is provided', async () => {
    const res = await request.get('/api/purchases/my-history');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/purchases', () => {
  it('should return a list of all purchases for an admin', async () => {
    await seedPurchase(customerId);
    const otherUserId = new mongoose.Types.ObjectId();
    await seedPurchase(otherUserId);

    const res = await request
      .get('/api/purchases')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0]).toHaveProperty('user');
    expect(res.body.data[0]).toHaveProperty('vehicle');
  });

  it('should return 403 Forbidden for a customer trying to access all purchases', async () => {
    const res = await request
      .get('/api/purchases')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
