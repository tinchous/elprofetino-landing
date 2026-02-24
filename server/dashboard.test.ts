import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb, getStudentByUserId, getUpcomingClasses, getStudentProgress, getPendingAssignments, getPeoToolAccess } from './db';
import { students, classes, progress, assignments, peoToolAccess, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Dashboard Database Operations', () => {
  let db: Awaited<ReturnType<typeof getDb>>;
  const testUserIds: number[] = [];

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error('Database not available for testing');
    }

    // Create test users first (to satisfy foreign key constraints)
    for (let i = 1; i <= 5; i++) {
      const openId = `test-dashboard-user-${i}-${Date.now()}`;
      await db.insert(users).values({
        openId,
        name: `Test User ${i}`,
        email: `test${i}@dashboard.test`,
        role: 'user',
      });
      
      const [user] = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
      if (user) {
        testUserIds.push(user.id);
      }
    }
  });

  afterAll(async () => {
    if (!db) return;

    // Clean up all test data
    for (const userId of testUserIds) {
      const student = await getStudentByUserId(userId);
      if (student) {
        await db.delete(peoToolAccess).where(eq(peoToolAccess.studentId, student.id));
        await db.delete(assignments).where(eq(assignments.studentId, student.id));
        await db.delete(progress).where(eq(progress.studentId, student.id));
        await db.delete(classes).where(eq(classes.studentId, student.id));
        await db.delete(students).where(eq(students.id, student.id));
      }
      await db.delete(users).where(eq(users.id, userId));
    }
  });

  describe('Student Management', () => {
    it('should retrieve student by userId', async () => {
      if (!db || testUserIds.length === 0) return;

      const testUserId = testUserIds[0];

      // Clean up any existing test data
      await db.delete(students).where(eq(students.userId, testUserId));

      // Insert test student
      await db.insert(students).values({
        userId: testUserId,
        level: 'bachillerato',
        subjects: JSON.stringify(['matematica', 'fisica']),
        phone: '+59812345678',
      });

      // Test the query function
      const student = await getStudentByUserId(testUserId);

      expect(student).toBeDefined();
      expect(student?.userId).toBe(testUserId);
      expect(student?.level).toBe('bachillerato');
    });
  });

  describe('Scheduled Classes', () => {
    it('should retrieve upcoming classes for a student', async () => {
      if (!db || testUserIds.length < 2) return;

      const testUserId = testUserIds[1];
      const futureDate = new Date(Date.now() + 86400000); // Tomorrow

      // Clean up
      await db.delete(students).where(eq(students.userId, testUserId));

      // Create test student
      await db.insert(students).values({
        userId: testUserId,
        level: '7-9',
        subjects: JSON.stringify(['matematica']),
      });

      // Get the student to get the ID
      const student = await getStudentByUserId(testUserId);
      if (!student) throw new Error('Student not created');

      // Clean up any existing classes
      await db.delete(classes).where(eq(classes.studentId, student.id));

      // Insert test class
      await db.insert(classes).values({
        studentId: student.id,
        subject: 'matematica',
        topic: 'Álgebra',
        scheduledAt: futureDate,
        duration: 60,
        status: 'scheduled',
      });

      // Test the query function
      const upcomingClasses = await getUpcomingClasses(student.id);

      expect(upcomingClasses).toBeDefined();
      expect(upcomingClasses.length).toBeGreaterThan(0);
      expect(upcomingClasses[0].topic).toBe('Álgebra');
    });
  });

  describe('Topic Progress', () => {
    it('should retrieve student progress', async () => {
      if (!db || testUserIds.length < 3) return;

      const testUserId = testUserIds[2];

      // Clean up
      await db.delete(students).where(eq(students.userId, testUserId));

      // Create test student
      await db.insert(students).values({
        userId: testUserId,
        level: '7-9',
        subjects: JSON.stringify(['matematica']),
      });

      const student = await getStudentByUserId(testUserId);
      if (!student) throw new Error('Student not created');

      // Clean up any existing progress
      await db.delete(progress).where(eq(progress.studentId, student.id));

      // Insert test progress
      await db.insert(progress).values({
        studentId: student.id,
        subject: 'matematica',
        topic: 'Fracciones',
        level: 75,
        lastPracticed: new Date(),
      });

      // Test the query function
      const studentProgress = await getStudentProgress(student.id);

      expect(studentProgress).toBeDefined();
      expect(studentProgress.length).toBeGreaterThan(0);
      expect(studentProgress[0].topic).toBe('Fracciones');
      expect(studentProgress[0].level).toBe(75);
    });
  });

  describe('Assigned Exercises', () => {
    it('should retrieve pending assignments', async () => {
      if (!db || testUserIds.length < 4) return;

      const testUserId = testUserIds[3];
      const dueDate = new Date(Date.now() + 86400000 * 7); // 1 week from now

      // Clean up
      await db.delete(students).where(eq(students.userId, testUserId));

      // Create test student
      await db.insert(students).values({
        userId: testUserId,
        level: '7-9',
        subjects: JSON.stringify(['matematica']),
      });

      const student = await getStudentByUserId(testUserId);
      if (!student) throw new Error('Student not created');

      // Clean up any existing assignments
      await db.delete(assignments).where(eq(assignments.studentId, student.id));

      // Insert test assignment
      await db.insert(assignments).values({
        studentId: student.id,
        subject: 'matematica',
        topic: 'Ecuaciones',
        description: 'Resolver 10 ecuaciones lineales',
        dueDate: dueDate,
        status: 'pending',
      });

      // Test the query function
      const pendingAssignments = await getPendingAssignments(student.id);

      expect(pendingAssignments).toBeDefined();
      expect(pendingAssignments.length).toBeGreaterThan(0);
      expect(pendingAssignments[0].description).toBe('Resolver 10 ecuaciones lineales');
      expect(pendingAssignments[0].status).toBe('pending');
    });
  });

  describe('PEO Tool Access', () => {
    it('should retrieve tool access for a student', async () => {
      if (!db || testUserIds.length < 5) return;

      const testUserId = testUserIds[4];

      // Clean up
      await db.delete(students).where(eq(students.userId, testUserId));

      // Create test student
      await db.insert(students).values({
        userId: testUserId,
        level: '7-9',
        subjects: JSON.stringify(['matematica']),
      });

      const student = await getStudentByUserId(testUserId);
      if (!student) throw new Error('Student not created');

      // Clean up any existing tool access
      await db.delete(peoToolAccess).where(eq(peoToolAccess.studentId, student.id));

      // Insert test tool access
      await db.insert(peoToolAccess).values({
        studentId: student.id,
        toolName: 'TizaIA',
        accessCount: 5,
        lastAccessed: new Date(),
      });

      // Test the query function
      const toolAccess = await getPeoToolAccess(student.id);

      expect(toolAccess).toBeDefined();
      expect(toolAccess.length).toBeGreaterThan(0);
      expect(toolAccess[0].toolName).toBe('TizaIA');
      expect(toolAccess[0].accessCount).toBe(5);
    });
  });
});
