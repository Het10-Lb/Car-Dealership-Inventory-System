import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import stream from 'stream';
import { v2 as cloudinary } from 'cloudinary';

let mongoServer;
let request;
let app;
let adminToken;
let customerToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  
  const appModule = await import('../../src/app.js');
  app = appModule.default;
  request = supertest(app);

  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
  const adminId = new mongoose.Types.ObjectId();
  adminToken = jwt.sign({ id: adminId, email: 'admin@test.com', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
  
  const customerId = new mongoose.Types.ObjectId();
  customerToken = jwt.sign({ id: customerId, email: 'customer@test.com', role: 'customer' }, JWT_SECRET, { expiresIn: '1h' });

  // MOCK CLOUDINARY UPLOAD_STREAM
  jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((options, callback) => {
    const pass = new stream.PassThrough();
    pass.on('finish', () => {
      if (callback) {
        callback(null, {
          secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mock_image.jpg',
          public_id: 'mock_image'
        });
      }
    });
    return pass;
  });
});

afterAll(async () => {
  jest.restoreAllMocks();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /api/upload', () => {
  it('should return 400 Bad Request with message "No image provided" if no file is attached', async () => {
    const res = await request
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('No image provided');
  });

  it('should allow an admin to upload an image and return the Cloudinary URL', async () => {
    const buffer = Buffer.from('dummy image content');
    const res = await request
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', buffer, 'test.jpg');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.imageUrl).toBe('https://res.cloudinary.com/demo/image/upload/v1234567890/mock_image.jpg');
  });

  it('should return 403 Forbidden for a non-admin user', async () => {
    const buffer = Buffer.from('dummy image content');
    const res = await request
      .post('/api/upload')
      .set('Authorization', `Bearer ${customerToken}`)
      .attach('image', buffer, 'test.jpg');

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
