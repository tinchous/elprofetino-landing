import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import { students, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Admin procedures', () => {
  let adminContext: any;
  let testUserId: number;
  let testStudentId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    // Create test user
    const [user] = await db.insert(users).values({
      openId: 'test-admin-' + Date.now(),
      name: 'Test Admin',
      email: 'testadmin@example.com',
      loginMethod: 'google',
      role: 'admin',
    });
    testUserId = user.insertId;

    // Create admin context
    adminContext = {
      user: {
        id: testUserId,
        openId: 'test-admin-' + Date.now(),
        name: 'Test Admin',
        email: 'testadmin@example.com',
        role: 'admin',
        loginMethod: 'google',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };
  });

  it('should list students', async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.listStudents();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should create a student', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    // Create a user for the student
    const [user] = await db.insert(users).values({
      openId: 'test-student-' + Date.now(),
      name: 'Test Student',
      email: 'teststudent@example.com',
      loginMethod: 'google',
      role: 'user',
    });
    const userId = user.insertId;

    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.createStudent({
      userId,
      level: 'bachillerato',
      subjects: '["matematica","fisica"]',
      phone: '+59812345678',
    });

    expect(result.success).toBe(true);
    expect(result.studentId).toBeDefined();
    
    // Store for later tests
    testStudentId = result.studentId;
  });

  it('should update a student', async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.updateStudent({
      id: testStudentId,
      level: '7-9',
      subjects: '["matematica"]',
      phone: '+59887654321',
    });

    expect(result.success).toBe(true);
  });

  it('should create a class', async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.createClass({
      studentId: testStudentId,
      subject: 'matematica',
      scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      duration: 60,
      topic: 'Álgebra lineal',
      notes: 'Clase de prueba',
    });

    expect(result.success).toBe(true);
  });

  it('should list classes', async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.listClasses({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should create an assignment', async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.createAssignment({
      studentId: testStudentId,
      subject: 'matematica',
      topic: 'Ecuaciones cuadráticas',
      description: 'Resolver ejercicios 1-10 del libro',
      dueDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    });

    expect(result.success).toBe(true);
  });

  it('should update progress', async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.updateProgress({
      studentId: testStudentId,
      subject: 'matematica',
      topic: 'Álgebra',
      level: 85,
    });

    expect(result.success).toBe(true);
  });

  it('should update tool access', async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.admin.updateToolAccess({
      studentId: testStudentId,
      toolName: 'tizaia',
      accessCount: 10,
    });

    expect(result.success).toBe(true);
  });

  it('should not allow non-admin users to access admin procedures', async () => {
    const nonAdminContext = {
      user: {
        id: testUserId,
        openId: 'test-user',
        name: 'Test User',
        email: 'testuser@example.com',
        role: 'user',
        loginMethod: 'google',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };

    const caller = appRouter.createCaller(nonAdminContext);
    
    try {
      await caller.admin.listStudents();
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toContain('permission');
    }
  });
});
