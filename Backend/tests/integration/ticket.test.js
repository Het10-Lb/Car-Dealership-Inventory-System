import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../src/app.js';
import Ticket from '../../src/models/ticketModel.js';
import jwt from 'jsonwebtoken';

let mongoServer, request, adminToken, customerToken, customerId, adminId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  request = supertest(app);

  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
  customerId = new mongoose.Types.ObjectId();
  customerToken = jwt.sign({ id: customerId, email: 'user@test.com', role: 'customer' }, JWT_SECRET, { expiresIn: '1h' });
  
  adminId = new mongoose.Types.ObjectId();
  adminToken = jwt.sign({ id: adminId, email: 'admin@test.com', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
});

afterEach(async () => {
  await Ticket.deleteMany({});
  jest.restoreAllMocks();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Ticket API Endpoints', () => {
  describe('POST /api/tickets', () => {
    it('should create a support ticket', async () => {
      const res = await request.post('/api/tickets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ subject: 'Help', message: 'I need assistance' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subject).toBe('Help');
    });

    it('should return 400 if subject or message is missing', async () => {
      const res = await request.post('/api/tickets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ subject: 'Help' }); // missing message

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Subject and message are required');
    });

    it('should return 500 if DB fails during creation', async () => {
      jest.spyOn(Ticket, 'create').mockRejectedValueOnce(new Error('DB Error'));
      const res = await request.post('/api/tickets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ subject: 'Help', message: 'I need assistance' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('DB Error');
    });
  });

  describe('GET /api/tickets/my-tickets', () => {
    it('should fetch tickets for a user', async () => {
      await Ticket.create({ user: customerId, subject: 'My Issue', message: 'Test message' });
      
      const res = await request.get('/api/tickets/my-tickets')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].subject).toBe('My Issue');
    });

    it('should return 500 if DB fails during fetch', async () => {
      jest.spyOn(Ticket, 'find').mockImplementationOnce(() => ({ sort: jest.fn().mockRejectedValueOnce(new Error('DB Error')) }));
      
      const res = await request.get('/api/tickets/my-tickets')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('DB Error');
    });
  });

  describe('GET /api/tickets', () => {
    it('should fetch all tickets for admin', async () => {
      await Ticket.create({ user: customerId, subject: 'My Issue', message: 'Test message' });
      
      const res = await request.get('/api/tickets')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('should return 500 if DB fails during fetch all', async () => {
      jest.spyOn(Ticket, 'find').mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValueOnce(new Error('DB Error'))
      }));

      const res = await request.get('/api/tickets')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('DB Error');
    });
  });

  describe('PUT /api/tickets/:id/resolve', () => {
    it('should resolve a ticket and provide adminResponse', async () => {
      const ticket = await Ticket.create({ user: customerId, subject: 'Issue', message: 'Test message' });

      const res = await request.put(`/api/tickets/${ticket._id}/resolve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ adminResponse: 'Fixed it' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Resolved');
      expect(res.body.data.adminResponse).toBe('Fixed it');
    });

    it('should return 400 if adminResponse is missing', async () => {
      const ticket = await Ticket.create({ user: customerId, subject: 'Issue', message: 'Test message' });

      const res = await request.put(`/api/tickets/${ticket._id}/resolve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({}); // Missing adminResponse

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Admin response is required');
    });

    it('should return 404 if ticket is not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.put(`/api/tickets/${fakeId}/resolve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ adminResponse: 'Fixed it' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Ticket not found');
    });

    it('should return 500 if DB fails during resolve', async () => {
      const ticket = await Ticket.create({ user: customerId, subject: 'Issue', message: 'Test message' });
      jest.spyOn(Ticket, 'findById').mockRejectedValueOnce(new Error('DB Error'));

      const res = await request.put(`/api/tickets/${ticket._id}/resolve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ adminResponse: 'Fixed it' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('DB Error');
    });
  });
});
