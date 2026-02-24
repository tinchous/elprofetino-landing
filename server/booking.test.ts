import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { users, students, classes } from "../drizzle/schema";
import { getAvailableSlots, bookClass } from "./db";
import { eq } from "drizzle-orm";

describe("Booking System", () => {
  let testUserId: number;
  let testStudentId: number;
  const createdClassIds: number[] = [];

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test user
    const userResult = await db.insert(users).values({
      openId: `test-booking-${Date.now()}`,
      name: "Test Booking User",
      email: `booking-${Date.now()}@test.com`,
      role: "user",
    });
    testUserId = userResult[0].insertId;

    // Create test student
    const studentResult = await db.insert(students).values({
      userId: testUserId,
      level: "bachillerato",
      subjects: "matematica,fisica",
      phone: "+598 99 999 999",
    });
    testStudentId = studentResult[0].insertId;
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Clean up test data
    if (createdClassIds.length > 0) {
      for (const classId of createdClassIds) {
        await db.delete(classes).where(eq(classes.id, classId));
      }
    }
  });

  it("should return available slots for a weekday", async () => {
    // Get next Monday
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
    
    const dateString = nextMonday.toISOString().split('T')[0];
    const slots = await getAvailableSlots(dateString);

    expect(slots).toBeDefined();
    expect(slots.length).toBeGreaterThan(0);
    // Verify each slot has required properties
    slots.forEach(slot => {
      expect(slot).toHaveProperty('time');
      expect(slot).toHaveProperty('available');
      expect(slot).toHaveProperty('scheduledAt');
      expect(typeof slot.available).toBe('boolean');
    });
  });

  it("should return empty array for weekend", async () => {
    // Get next Saturday
    const today = new Date();
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + ((6 + 7 - today.getDay()) % 7 || 7));
    
    const dateString = nextSaturday.toISOString().split('T')[0];
    const slots = await getAvailableSlots(dateString);

    expect(slots).toBeDefined();
    expect(slots.length).toBe(0);
  });

  it("should book a class successfully", async () => {
    // Use a date far in the future to avoid conflicts
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // 1 year from now
    futureDate.setMonth(2); // March
    futureDate.setDate(15); // 15th
    futureDate.setHours(11, 0, 0, 0);
    
    const result = await bookClass({
      studentId: testStudentId,
      scheduledAt: futureDate.toISOString(),
      subject: "matematica",
      topic: "Funciones trigonométricas",
      duration: 60,
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Clase reservada exitosamente");

    // Verify class was created
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const bookedClasses = await db
      .select()
      .from(classes)
      .where(eq(classes.studentId, testStudentId));

    expect(bookedClasses.length).toBeGreaterThan(0);
    const bookedClass = bookedClasses.find(c => c.topic === "Funciones trigonométricas");
    expect(bookedClass).toBeDefined();
    expect(bookedClass?.subject).toBe("matematica");
    expect(bookedClass?.duration).toBe(60);
    
    if (bookedClass) {
      createdClassIds.push(bookedClass.id);
    }
  });

  it("should create multiple classes on different dates", async () => {
    // Book first class
    const date1 = new Date();
    date1.setFullYear(date1.getFullYear() + 1);
    date1.setMonth(3); // April
    date1.setDate(20);
    date1.setHours(15, 0, 0, 0);
    
    const result1 = await bookClass({
      studentId: testStudentId,
      scheduledAt: date1.toISOString(),
      subject: "fisica",
      topic: "Cinemática",
      duration: 60,
    });

    expect(result1.success).toBe(true);

    // Book second class on different date
    const date2 = new Date();
    date2.setFullYear(date2.getFullYear() + 1);
    date2.setMonth(4); // May
    date2.setDate(25);
    date2.setHours(18, 0, 0, 0);
    
    const result2 = await bookClass({
      studentId: testStudentId,
      scheduledAt: date2.toISOString(),
      subject: "matematica",
      topic: "Límites",
      duration: 60,
    });

    expect(result2.success).toBe(true);

    // Verify both classes were created
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const bookedClasses = await db
      .select()
      .from(classes)
      .where(eq(classes.studentId, testStudentId));

    const class1 = bookedClasses.find(c => c.topic === "Cinemática");
    const class2 = bookedClasses.find(c => c.topic === "Límites");
    
    expect(class1).toBeDefined();
    expect(class2).toBeDefined();
    
    if (class1) createdClassIds.push(class1.id);
    if (class2) createdClassIds.push(class2.id);
  });

  it("should prevent double booking at the same time", async () => {
    // Book first class
    const conflictDate = new Date();
    conflictDate.setFullYear(conflictDate.getFullYear() + 1);
    conflictDate.setMonth(5); // June
    conflictDate.setDate(10);
    conflictDate.setHours(16, 0, 0, 0);
    
    const result1 = await bookClass({
      studentId: testStudentId,
      scheduledAt: conflictDate.toISOString(),
      subject: "matematica",
      topic: "Derivadas",
      duration: 60,
    });

    expect(result1.success).toBe(true);

    // Try to book same slot - should fail
    await expect(
      bookClass({
        studentId: testStudentId,
        scheduledAt: conflictDate.toISOString(),
        subject: "fisica",
        topic: "Dinámica",
        duration: 60,
      })
    ).rejects.toThrow("Este horario ya no está disponible");
    
    // Clean up
    const db = await getDb();
    if (!db) return;
    
    const bookedClasses = await db
      .select()
      .from(classes)
      .where(eq(classes.studentId, testStudentId));
    
    const class1 = bookedClasses.find(c => c.topic === "Derivadas");
    if (class1) createdClassIds.push(class1.id);
  });
});
