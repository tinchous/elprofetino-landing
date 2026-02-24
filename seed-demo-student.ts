import { drizzle } from "drizzle-orm/mysql2";
import { students, classes, progress, assignments, peoToolAccess } from "./drizzle/schema";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);

async function seedDemoStudent() {
  console.log("🌱 Seeding demo student data...");

  try {
    // 1. Create student profile for user ID 1 (admin)
    console.log("Creating student profile...");
    await db.insert(students).values({
      userId: 1,
      level: "bachillerato",
      subjects: JSON.stringify(["matematica", "fisica"]),
      phone: "+59898175225",
    });

    // Get the created student
    const [student] = await db.select().from(students).where((t) => t.userId === 1).limit(1);
    
    if (!student) {
      throw new Error("Failed to create student");
    }

    console.log(`✅ Student created with ID: ${student.id}`);

    // 2. Add upcoming classes
    console.log("Adding upcoming classes...");
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(classes).values([
      {
        studentId: student.id,
        subject: "matematica",
        topic: "Funciones Trigonométricas",
        scheduledAt: tomorrow,
        duration: 60,
        status: "scheduled",
      },
      {
        studentId: student.id,
        subject: "fisica",
        topic: "Cinemática - Movimiento Rectilíneo Uniforme",
        scheduledAt: in3Days,
        duration: 60,
        status: "scheduled",
      },
      {
        studentId: student.id,
        subject: "matematica",
        topic: "Límites y Continuidad",
        scheduledAt: in5Days,
        duration: 60,
        status: "scheduled",
      },
      {
        studentId: student.id,
        subject: "fisica",
        topic: "Dinámica - Leyes de Newton",
        scheduledAt: in7Days,
        duration: 60,
        status: "scheduled",
      },
    ]);

    console.log("✅ Classes added");

    // 3. Add progress on different topics
    console.log("Adding topic progress...");
    await db.insert(progress).values([
      {
        studentId: student.id,
        subject: "matematica",
        topic: "Álgebra Lineal",
        level: 85,
        lastPracticed: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: student.id,
        subject: "matematica",
        topic: "Funciones Exponenciales",
        level: 72,
        lastPracticed: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: student.id,
        subject: "matematica",
        topic: "Derivadas",
        level: 60,
        lastPracticed: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: student.id,
        subject: "fisica",
        topic: "Vectores",
        level: 90,
        lastPracticed: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: student.id,
        subject: "fisica",
        topic: "Energía Cinética y Potencial",
        level: 78,
        lastPracticed: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: student.id,
        subject: "fisica",
        topic: "Trabajo y Potencia",
        level: 65,
        lastPracticed: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log("✅ Progress added");

    // 4. Add pending assignments
    console.log("Adding assignments...");
    const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const in4Days = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    const in6Days = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);

    await db.insert(assignments).values([
      {
        studentId: student.id,
        subject: "matematica",
        topic: "Funciones Trigonométricas",
        description: "Resolver ejercicios 1-15 del capítulo 8. Graficar seno, coseno y tangente.",
        dueDate: in2Days,
        status: "pending",
      },
      {
        studentId: student.id,
        subject: "fisica",
        topic: "Cinemática",
        description: "Problemas de MRU y MRUV: calcular velocidad, aceleración y distancia en 10 ejercicios.",
        dueDate: in4Days,
        status: "pending",
      },
      {
        studentId: student.id,
        subject: "matematica",
        topic: "Límites",
        description: "Calcular límites usando propiedades algebraicas. Ejercicios 20-35.",
        dueDate: in6Days,
        status: "pending",
      },
    ]);

    console.log("✅ Assignments added");

    // 5. Add PEO tool access
    console.log("Adding PEO tool access...");
    await db.insert(peoToolAccess).values([
      {
        studentId: student.id,
        toolName: "TizaIA",
        accessCount: 15,
        lastAccessed: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: student.id,
        toolName: "GeneraTusEjercicios",
        accessCount: 8,
        lastAccessed: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: student.id,
        toolName: "TuExamenPersonal",
        accessCount: 3,
        lastAccessed: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log("✅ PEO tool access added");

    console.log("\n🎉 Demo student data seeded successfully!");
    console.log(`Student ID: ${student.id}`);
    console.log(`User ID: 1 (admin)`);
    console.log(`Level: Bachillerato`);
    console.log(`Subjects: Matemática, Física`);
    console.log(`Upcoming classes: 4`);
    console.log(`Topics with progress: 6`);
    console.log(`Pending assignments: 3`);
    console.log(`PEO tools accessed: 3`);

  } catch (error) {
    console.error("❌ Error seeding demo student:", error);
    throw error;
  }
}

seedDemoStudent()
  .then(() => {
    console.log("✅ Seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
