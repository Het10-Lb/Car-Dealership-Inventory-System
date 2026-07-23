import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/userModel.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let request;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  request = supertest(app);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// ─── REGISTER ────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'Het Patel',
    email: 'het@example.com',
    password: 'Password123',
  };

  it('should register a new user and return 201', async () => {
    const res = await request.post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.token.split('.')).toHaveLength(3);
    expect(res.body.data).toHaveProperty('email', validUser.email);
    expect(res.body.data).toHaveProperty('name', validUser.name);
    expect(res.body.data).toHaveProperty('role', 'customer');
    // Password must NOT be in the response
    expect(res.body.data).not.toHaveProperty('password');
  });

  it('should hash the password before storing in DB', async () => {
    await request.post('/api/auth/register').send(validUser);

    const userInDb = await User.findOne({ email: validUser.email });
    expect(userInDb).not.toBeNull();
    // Stored hash must differ from the plaintext password
    expect(userInDb.password).not.toBe(validUser.password);
    // bcrypt hashes start with $2a$ or $2b$
    expect(userInDb.password).toMatch(/^\$2[ab]\$/);
  });

  it('should return 400 when name is missing', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({ email: 'a@b.com', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it('should return 400 when email is missing', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({ name: 'Test', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when password is missing', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'a@b.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 409 when email already exists', async () => {
    // Register once
    await request.post('/api/auth/register').send(validUser);
    // Attempt duplicate
    const res = await request.post('/api/auth/register').send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should assign the admin role automatically if the email is admin@car.com', async () => {
    const adminUser = {
      name: 'System Admin',
      email: 'admin@car.com',
      password: 'admin',
    };

    const res = await request.post('/api/auth/register').send(adminUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('role', 'admin');
  });
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  const validUser = {
    name: 'Het Patel',
    email: 'het@example.com',
    password: 'Password123',
  };

  // Seed a user before each login test
  beforeAll(async () => {
    await supertest(app).post('/api/auth/register').send(validUser);
  });

  it('should login successfully and return a JWT token', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    // JWT format: header.payload.signature
    expect(res.body.data.token.split('.')).toHaveLength(3);
  });

  it('should return 401 for non-existent email', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Password123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should return 401 for wrong password', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should return 400 when email is missing', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ password: 'Password123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when password is missing', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: 'het@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── SETTINGS / PROFILE ──────────────────────────────────────────────────────

describe('PUT /api/auth/profile', () => {
  let token;
  let user;

  beforeEach(async () => {
    user = await User.create({
      name: 'Profile User',
      email: `profile_${Date.now()}@example.com`,
      password: 'Password123',
    });
    token = jwt.sign({ id: user._id, role: 'customer' }, process.env.JWT_SECRET || 'dev-secret-key', { expiresIn: '1h' });
  });

  it('should update user profile successfully', async () => {
    const res = await request
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated Name');
  });

  it('should return 404 if user not found during profile update', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const fakeToken = jwt.sign({ id: fakeId, role: 'customer' }, process.env.JWT_SECRET || 'dev-secret-key', { expiresIn: '1h' });
    
    const res = await request
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ name: 'Fake' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});

describe('PUT /api/auth/password', () => {
  let token;
  let user;

  beforeEach(async () => {
    // Need to use bcrypt or let the pre-save hook hash it if it exists.
    // The userModel probably has a pre('save') hook for hashing passwords.
    user = await User.create({
      name: 'Pass User',
      email: `pass_${Date.now()}@example.com`,
      password: 'Password123',
    });
    token = jwt.sign({ id: user._id, role: 'customer' }, process.env.JWT_SECRET || 'dev-secret-key', { expiresIn: '1h' });
  });

  it('should update password successfully', async () => {
    const res = await request
      .put('/api/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'Password123', newPassword: 'NewPassword123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 400 if passwords are missing', async () => {
    const res = await request
      .put('/api/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'Password123' }); // missing new

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Current and new passwords are required');
  });

  it('should return 401 if current password is wrong', async () => {
    const res = await request
      .put('/api/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'WrongPassword', newPassword: 'NewPassword123' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid current password');
  });

  it('should return 404 if user not found during password update', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const fakeToken = jwt.sign({ id: fakeId, role: 'customer' }, process.env.JWT_SECRET || 'dev-secret-key', { expiresIn: '1h' });
    
    const res = await request
      .put('/api/auth/password')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ currentPassword: 'Password123', newPassword: 'NewPassword123' });

    expect(res.status).toBe(404);
  });
});
