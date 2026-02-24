import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, students, classes, progress, assignments, peoToolAccess, exams, examQuestions, examAnswers, examResults, Student, Class, Progress, Assignment, PeoToolAccess, Exam, ExamQuestion, ExamAnswer, ExamResult, InsertExam, InsertExamQuestion, InsertExamAnswer, InsertExamResult } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Student queries
export async function getStudentByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(students)
    .where(eq(students.userId, userId))
    .limit(1);
  
  return result[0] || null;
}

// Users queries
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(users)
    .orderBy(users.createdAt);
  
  return result;
}

export async function createStudent(data: { userId: number; level?: string; institution?: string; subjects?: string; phone?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(students).values(data);
  return { success: true, studentId: result[0].insertId };
}

// Classes queries
export async function getUpcomingClasses(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  const result = await db.select().from(classes)
    .where(eq(classes.studentId, studentId))
    .orderBy(classes.scheduledAt);
  
  return result.filter(c => c.status === "scheduled" && c.scheduledAt >= now);
}

export async function getClassHistory(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(classes)
    .where(eq(classes.studentId, studentId))
    .orderBy(classes.scheduledAt);
  
  return result.filter(c => c.status === "completed");
}

// Progress queries
export async function getStudentProgress(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(progress)
    .where(eq(progress.studentId, studentId))
    .orderBy(progress.subject, progress.topic);
  
  return result;
}

// Assignments queries
export async function getPendingAssignments(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(assignments)
    .where(eq(assignments.studentId, studentId))
    .orderBy(assignments.dueDate);
  
  return result.filter(a => a.status === "pending");
}

export async function getCompletedAssignments(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(assignments)
    .where(eq(assignments.studentId, studentId))
    .orderBy(assignments.completedAt);
  
  return result.filter(a => a.status === "completed");
}

// PEO Tool Access queries
export async function getPeoToolAccess(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(peoToolAccess)
    .where(eq(peoToolAccess.studentId, studentId));
  
  return result;
}

export async function updatePeoToolAccess(studentId: number, toolName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(peoToolAccess)
    .where(eq(peoToolAccess.studentId, studentId))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(peoToolAccess)
      .set({ 
        accessCount: existing[0].accessCount + 1,
        lastAccessed: new Date()
      })
      .where(eq(peoToolAccess.id, existing[0].id));
  } else {
    await db.insert(peoToolAccess).values({
      studentId,
      toolName,
      accessCount: 1,
      lastAccessed: new Date()
    });
  }
}

// Admin functions for student management
export async function getAllStudents() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: students.id,
    userId: students.userId,
    level: students.level,
    institution: students.institution,
    subjects: students.subjects,
    phone: students.phone,
    createdAt: students.createdAt,
    updatedAt: students.updatedAt,
    userName: users.name,
    userEmail: users.email,
  })
  .from(students)
  .leftJoin(users, eq(students.userId, users.id))
  .orderBy(students.createdAt);
  
  return result;
}

export async function updateStudent(data: { id: number; level?: string; subjects?: string; phone?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { id, ...updateData } = data;
  await db.update(students).set(updateData).where(eq(students.id, id));
  return { success: true };
}

export async function deleteStudent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete related records first (cascade)
  await db.delete(classes).where(eq(classes.studentId, id));
  await db.delete(progress).where(eq(progress.studentId, id));
  await db.delete(assignments).where(eq(assignments.studentId, id));
  await db.delete(peoToolAccess).where(eq(peoToolAccess.studentId, id));
  
  // Delete student
  await db.delete(students).where(eq(students.id, id));
  return { success: true };
}

// Admin functions for class management
export async function getAllClasses() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    id: classes.id,
    studentId: classes.studentId,
    subject: classes.subject,
    scheduledAt: classes.scheduledAt,
    duration: classes.duration,
    status: classes.status,
    topic: classes.topic,
    notes: classes.notes,
    createdAt: classes.createdAt,
    updatedAt: classes.updatedAt,
    studentName: users.name,
  })
  .from(classes)
  .leftJoin(students, eq(classes.studentId, students.id))
  .leftJoin(users, eq(students.userId, users.id))
  .orderBy(classes.scheduledAt);
  
  return result;
}

export async function getClassesByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(classes)
    .where(eq(classes.studentId, studentId))
    .orderBy(classes.scheduledAt);
  
  return result;
}

export async function createClass(data: { 
  studentId: number; 
  subject: string; 
  scheduledAt: Date; 
  duration?: number;
  topic?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(classes).values({
    ...data,
    duration: data.duration || 60,
  });
  return { success: true };
}

export async function updateClass(data: { 
  id: number; 
  scheduledAt?: Date;
  duration?: number;
  status?: "scheduled" | "completed" | "cancelled";
  topic?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { id, ...updateData } = data;
  await db.update(classes).set(updateData).where(eq(classes.id, id));
  return { success: true };
}

export async function deleteClass(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(classes).where(eq(classes.id, id));
  return { success: true };
}

// Admin functions for assignment management
export async function createAssignment(data: {
  studentId: number;
  subject: string;
  topic: string;
  description: string;
  dueDate?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(assignments).values(data);
  return { success: true };
}

export async function updateAssignment(data: {
  id: number;
  status?: "pending" | "completed";
  score?: number;
  completedAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { id, ...updateData } = data;
  await db.update(assignments).set(updateData).where(eq(assignments.id, id));
  return { success: true };
}

// Admin functions for progress management
export async function updateProgress(data: {
  studentId: number;
  subject: string;
  topic: string;
  level: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if progress record exists
  const existing = await db.select().from(progress)
    .where(eq(progress.studentId, data.studentId))
    .limit(1);
  
  const existingRecord = existing.find(p => p.subject === data.subject && p.topic === data.topic);
  
  if (existingRecord) {
    // Update existing record
    await db.update(progress)
      .set({ 
        level: data.level,
        lastPracticed: new Date()
      })
      .where(eq(progress.id, existingRecord.id));
  } else {
    // Create new record
    await db.insert(progress).values({
      ...data,
      lastPracticed: new Date()
    });
  }
  
  return { success: true };
}

// Admin functions for tool access management
export async function updateToolAccess(data: {
  studentId: number;
  toolName: string;
  accessCount: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if record exists
  const existing = await db.select().from(peoToolAccess)
    .where(eq(peoToolAccess.studentId, data.studentId))
    .limit(1);
  
  const existingRecord = existing.find(p => p.toolName === data.toolName);
  
  if (existingRecord) {
    // Update existing record
    await db.update(peoToolAccess)
      .set({ 
        accessCount: data.accessCount,
        lastAccessed: new Date()
      })
      .where(eq(peoToolAccess.id, existingRecord.id));
  } else {
    // Create new record
    await db.insert(peoToolAccess).values({
      ...data,
      lastAccessed: new Date()
    });
  }
  
  return { success: true };
}

// ============================================
// Booking Functions
// ============================================

export async function getAvailableSlots(date: string) {
  const db = await getDb();
  if (!db) return [];
  
  // Parse the date
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Available hours: Monday-Friday 11:00-12:00, 15:00-17:00, 18:00-20:00
  // Skip weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return [];
  }
  
  const availableHours = [
    { start: 11, end: 12 },
    { start: 15, end: 17 },
    { start: 18, end: 20 },
  ];
  
  // Get all classes scheduled for this date
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { gte, lte, and } = await import("drizzle-orm");
  
  const bookedClasses = await db
    .select()
    .from(classes)
    .where(
      and(
        gte(classes.scheduledAt, startOfDay),
        lte(classes.scheduledAt, endOfDay),
        eq(classes.status, 'scheduled')
      )
    );
  
  // Generate all possible slots
  const slots: Array<{
    time: string;
    available: boolean;
    scheduledAt: Date;
  }> = [];
  
  for (const period of availableHours) {
    for (let hour = period.start; hour < period.end; hour++) {
      const slotTime = new Date(targetDate);
      slotTime.setHours(hour, 0, 0, 0);
      
      // Check if this slot is already booked
      const isBooked = bookedClasses.some(bookedClass => {
        const bookedStart = new Date(bookedClass.scheduledAt);
        const bookedEnd = new Date(bookedStart.getTime() + (bookedClass.duration || 60) * 60000);
        const slotEnd = new Date(slotTime.getTime() + 60 * 60000); // 1 hour slot
        
        // Check for overlap using timestamps
        const slotStartTime = slotTime.getTime();
        const slotEndTime = slotEnd.getTime();
        const bookedStartTime = bookedStart.getTime();
        const bookedEndTime = bookedEnd.getTime();
        
        return (slotStartTime < bookedEndTime && slotEndTime > bookedStartTime);
      });
      
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: !isBooked,
        scheduledAt: slotTime,
      });
    }
  }
  
  return slots;
}

export async function bookClass(data: {
  studentId: number;
  scheduledAt: string;
  subject: string;
  topic?: string;
  duration: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const scheduledDate = new Date(data.scheduledAt);
  const scheduledEnd = new Date(scheduledDate.getTime() + data.duration * 60000);
  
  const { and, gte, lte } = await import("drizzle-orm");
  
  // Get all classes on the same day
  const startOfDay = new Date(scheduledDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(scheduledDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  const existingClasses = await db
    .select()
    .from(classes)
    .where(
      and(
        gte(classes.scheduledAt, startOfDay),
        lte(classes.scheduledAt, endOfDay),
        eq(classes.status, 'scheduled')
      )
    );
  
  // Check for time conflicts
  const hasConflict = existingClasses.some(existingClass => {
    const existingStart = new Date(existingClass.scheduledAt);
    const existingEnd = new Date(existingStart.getTime() + (existingClass.duration || 60) * 60000);
    
    // Check for overlap using timestamps
    const scheduledStartTime = scheduledDate.getTime();
    const scheduledEndTime = scheduledEnd.getTime();
    const existingStartTime = existingStart.getTime();
    const existingEndTime = existingEnd.getTime();
    
    return (scheduledStartTime < existingEndTime && scheduledEndTime > existingStartTime);
  });
  
  if (hasConflict) {
    throw new Error('Este horario ya no está disponible');
  }
  
  // Create the class
  await db.insert(classes).values({
    studentId: data.studentId,
    subject: data.subject,
    topic: data.topic || `Clase de ${data.subject}`,
    scheduledAt: scheduledDate,
    duration: data.duration,
    status: 'scheduled',
  });
  
  return { success: true, message: 'Clase reservada exitosamente' };
}

// ============================================
// Exam Management Functions
// ============================================

/**
 * Create a new exam
 */
export async function createExam(data: InsertExam) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(exams).values(data);
  return { success: true, examId: result[0].insertId };
}

/**
 * Get exam by ID
 */
export async function getExamById(examId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(exams).where(eq(exams.id, examId)).limit(1);
  return result[0] || null;
}

/**
 * Get exams by student ID
 */
export async function getExamsByStudentId(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(exams)
    .where(eq(exams.studentId, studentId))
    .orderBy(exams.createdAt);
  
  return result;
}

/**
 * Update exam status
 */
export async function updateExamStatus(examId: number, status: "in_progress" | "completed" | "abandoned", completedAt?: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status };
  if (completedAt) {
    updateData.completedAt = completedAt;
  }
  
  await db.update(exams).set(updateData).where(eq(exams.id, examId));
  return { success: true };
}

/**
 * Create exam questions
 */
export async function createExamQuestions(questions: InsertExamQuestion[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(examQuestions).values(questions);
  return { success: true };
}

/**
 * Get questions by exam ID
 */
export async function getQuestionsByExamId(examId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(examQuestions)
    .where(eq(examQuestions.examId, examId))
    .orderBy(examQuestions.questionNumber);
  
  return result;
}

/**
 * Save student answer
 */
export async function saveExamAnswer(data: InsertExamAnswer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if answer already exists
  const existing = await db.select().from(examAnswers)
    .where(eq(examAnswers.questionId, data.questionId!))
    .limit(1);
  
  if (existing.length > 0) {
    // Update existing answer
    await db.update(examAnswers)
      .set({ studentAnswer: data.studentAnswer, answeredAt: data.answeredAt })
      .where(eq(examAnswers.id, existing[0].id));
    return { success: true, answerId: existing[0].id };
  } else {
    // Insert new answer
    const result = await db.insert(examAnswers).values(data);
    return { success: true, answerId: result[0].insertId };
  }
}

/**
 * Get answers by exam ID
 */
export async function getAnswersByExamId(examId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(examAnswers)
    .where(eq(examAnswers.examId, examId));
  
  return result;
}

/**
 * Update answer evaluation
 */
export async function updateAnswerEvaluation(answerId: number, isCorrect: number, pointsEarned: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(examAnswers)
    .set({ isCorrect, pointsEarned })
    .where(eq(examAnswers.id, answerId));
  
  return { success: true };
}

/**
 * Create exam result
 */
export async function createExamResult(data: InsertExamResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(examResults).values(data);
  return { success: true, resultId: result[0].insertId };
}

/**
 * Get result by exam ID
 */
export async function getResultByExamId(examId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(examResults)
    .where(eq(examResults.examId, examId))
    .limit(1);
  
  return result[0] || null;
}

/**
 * Get results by student ID
 */
export async function getResultsByStudentId(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(examResults)
    .where(eq(examResults.studentId, studentId))
    .orderBy(examResults.createdAt);
  
  return result;
}
