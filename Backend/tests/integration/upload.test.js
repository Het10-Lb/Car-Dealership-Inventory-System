import { jest } from '@jest/globals';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

let mongoServer;
let request;
let app;

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

// Mock cloudinary before importing app
jest.unstable_mockModule('cloudinary', () => {
  return {
    v2: {
      config: jest.fn(),
      uploader: {
        upload_stream: jest.fn((options, callback) => {
           const stream = require('stream');
           const pass = new stream.PassThrough();
           pass.on('finish', () => {
             // Simulate successful upload response
             callback(null, {
               secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mock_image.jpg',
               public_id: 'mock_image'
             });
           });
           return pass;
        })
      }
    },
    default: {
      v2: {
        config: jest.fn(),
        uploader: {
          upload_stream: jest.fn((options, callback) => {
             const stream = require('stream');
             const pass = new stream.PassThrough();
             pass.on('finish', () => {
               callback(null, {
                 secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mock_image.jpg',
                 public_id: 'mock_image'
               });
             });
             return pass;
          })
        }
      }
    }
  };
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  
  // Dynamically import app so the mock takes effect
  const appModule = await import('../../src/app.js');
  app = appModule.default;
  request = supertest(app);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /api/upload', () => {
  it('should allow an admin to upload an image and return the Cloudinary URL', async () => {
    // Create a dummy buffer for the file
    const buffer = Buffer.from('dummy image content');

    const res = await request
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', buffer, 'test.jpg');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('imageUrl');
    expect(res.body.data.imageUrl).toBe('https://res.cloudinary.com/demo/image/upload/v1234567890/mock_image.jpg');
  });

  it('should return 400 Bad Request if no file is uploaded', async () => {
    const res = await request
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
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
