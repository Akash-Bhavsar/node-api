import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js'; // Ensure your Express app is exported from this file
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Endpoints', () => {
  let token = '';
  let userId = null;

  let createdUserIds = []; // To store IDs of users created during tests
  let createdTaskIds = []; // To store IDs of tasks created during tests
  beforeAll(async () => {
    // Check if the test user exists and delete it
    const existingUser = await prisma.user.findUnique({
      where: { username: 'vitestuser' },
    });

    if (existingUser) {
      console.log('Deleting existing test user:', existingUser.id);
      await prisma.user.delete({
        where: { id: existingUser.id },
      });
      console.log('Existing test user deleted');
    }
  });
  test('Register a new user', async () => {
    try {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'vitestuser',
          password: 'vitestpassword',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username');
      userId = res.body.id;
      createdUserIds.push(userId); // Store the created user's ID
    } catch (error) {
      console.error('Test failed during user registration');
      throw error; // Re-throw the error to fail the test
    }
  });

  test('Login user and receive token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'vitestuser',
        password: 'vitestpassword',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('List users (requires authentication)', async () => {
    const res = await request(app)
      .get('/api/users/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Update user profile', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updatedvitestuser',
        password: 'newpassword',
        role: 'ADMIN'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual('updatedvitestuser');
    expect(res.body.role).toEqual('ADMIN');
  });

    // Cleanup function to delete users and tasks
    const cleanup = async () => {
      for (const userId of createdUserIds) {
        try {
          await prisma.user.delete({
            where: { id: userId },
          });
          console.log('User deleted:', userId);
        } catch (error) {
          console.error('Error deleting user:', userId, error);
        }
      }
      createdUserIds = []; // Clear the array after deletion

          for (const taskId of createdTaskIds) {
            try {
              await prisma.task.delete({
                where: { id: taskId },
              });
              console.log('Task deleted:', taskId);
            } catch (error) {
              console.error('Error deleting task:', taskId, error);
            }
          }
          createdTaskIds = []; // Clear the array after deletion
    };

    afterAll(async () => {
      await cleanup(); // Call cleanup after all tests
      await prisma.$disconnect();
    });
});

describe('Task Endpoints', () => {
  let token = '';
  let taskId = null;
  let taskUserId = null;
  let createdTaskIds = [];

  beforeAll(async () => {
    // Check if the test user exists
    let existingTaskUser = await prisma.user.findUnique({
      where: { username: 'taskvitestuser' },
    });

    if (!existingTaskUser) {
      // Create a test user for task tests if one doesn't exist
      const registerRes = await request(app)
        .post('/api/users/register')
        .send({ username: 'taskvitestuser', password: 'taskvitestpassword' });
      existingTaskUser = registerRes.body;
    }
    taskUserId = existingTaskUser.id;
    // Login user to retrieve token
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ username: 'taskvitestuser', password: 'taskvitestpassword' });
    token = loginRes.body.token;
  });

  test('Create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Vitest Task',
        description: 'Task for vitest tests',
        status: 'pending'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual('Vitest Task');
    taskId = res.body.id;
    createdTaskIds.push(taskId);
  });

  test('Get my tasks', async () => {
    const res = await request(app)
      .get('/api/tasks/my-tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Optionally, verify that each task's userId matches the logged-in user
    if (res.body.length > 0) {
      expect(res.body[0].userId).toBeDefined();
    }
  });

  test('Update the task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Task Title',
        description: 'Updated description',
        status: 'completed'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Updated Task Title');
    expect(res.body.status).toEqual('completed');
  });

  test('Delete the task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Task deleted successfully');
  });

  afterAll(async () => {
    // Delete the test user
    if (taskUserId) {
      try {
      await prisma.user.delete({
        where: { id: taskUserId },
      });
      console.log('Test user deleted:', taskUserId);
      } catch (error) {
      console.error('Error deleting test user:', taskUserId, error);
      }
    }
    await prisma.$disconnect();
    });
});
