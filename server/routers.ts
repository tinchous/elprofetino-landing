import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router, TRPCError } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  dashboard: router({
    getStudent: protectedProcedure.query(async ({ ctx }) => {
      const student = await db.getStudentByUserId(ctx.user.id);
      return student || null;
    }),
    
    getUpcomingClasses: protectedProcedure.query(async ({ ctx }) => {
      const student = await db.getStudentByUserId(ctx.user.id);
      if (!student) return [];
      return db.getUpcomingClasses(student.id);
    }),
    
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const student = await db.getStudentByUserId(ctx.user.id);
      if (!student) return [];
      return db.getStudentProgress(student.id);
    }),
    
    getPendingAssignments: protectedProcedure.query(async ({ ctx }) => {
      const student = await db.getStudentByUserId(ctx.user.id);
      if (!student) return [];
      return db.getPendingAssignments(student.id);
    }),
    
    getPeoToolAccess: protectedProcedure.query(async ({ ctx }) => {
      const student = await db.getStudentByUserId(ctx.user.id);
      if (!student) return [];
      return db.getPeoToolAccess(student.id);
    }),

    // Booking procedures
    getAvailableSlots: protectedProcedure
      .input(z.object({
        date: z.string(), // ISO date string
      }))
      .query(async ({ input }) => {
        return db.getAvailableSlots(input.date);
      }),

    bookClass: protectedProcedure
      .input(z.object({
        scheduledAt: z.string(), // ISO datetime string
        subject: z.enum(['matematica', 'fisica']),
        topic: z.string().optional(),
        duration: z.number().min(30).max(180).default(60),
      }))
      .mutation(async ({ ctx, input }) => {
        const student = await db.getStudentByUserId(ctx.user.id);
        if (!student) throw new Error('Perfil de estudiante no encontrado');
        
        return db.bookClass({
          studentId: student.id,
          scheduledAt: input.scheduledAt,
          subject: input.subject,
          topic: input.topic,
          duration: input.duration,
        });
      }),
  }),

  admin: router({    // Gestión de estudiantes
    listUsers: adminProcedure.query(async () => {
      return db.getAllUsers();
    }),

    listStudents: adminProcedure.query(async () => {
      return db.getAllStudents();
    }),

    createStudent: adminProcedure
      .input(z.object({
        userId: z.number(),
        level: z.string().optional(),
        institution: z.string().optional(),
        subjects: z.string().optional(), // JSON string
        phone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createStudent(input);
      }),

    updateStudent: adminProcedure
      .input(z.object({
        id: z.number(),
        level: z.string().optional(),
        institution: z.string().optional(),
        subjects: z.string().optional(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.updateStudent(input);
      }),

    deleteStudent: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteStudent(input.id);
      }),

    // Gestión de clases
    listClasses: adminProcedure
      .input(z.object({ studentId: z.number().optional() }))
      .query(async ({ input }) => {
        if (input.studentId) {
          return db.getClassesByStudent(input.studentId);
        }
        return db.getAllClasses();
      }),

    createClass: adminProcedure
      .input(z.object({
        studentId: z.number(),
        subject: z.string(),
        scheduledAt: z.string(), // ISO date string
        duration: z.number().default(60),
        topic: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createClass({
          ...input,
          scheduledAt: new Date(input.scheduledAt),
        });
      }),

    updateClass: adminProcedure
      .input(z.object({
        id: z.number(),
        scheduledAt: z.string().optional(),
        duration: z.number().optional(),
        status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
        topic: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, scheduledAt, ...rest } = input;
        return db.updateClass({
          id,
          ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
          ...rest,
        });
      }),

    deleteClass: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteClass(input.id);
      }),

    // Gestión de ejercicios
    createAssignment: adminProcedure
      .input(z.object({
        studentId: z.number(),
        subject: z.string(),
        topic: z.string(),
        description: z.string(),
        dueDate: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createAssignment({
          ...input,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        });
      }),

    updateAssignment: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "completed"]).optional(),
        score: z.number().optional(),
        completedAt: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, completedAt, ...rest } = input;
        return db.updateAssignment({
          id,
          ...(completedAt && { completedAt: new Date(completedAt) }),
          ...rest,
        });
      }),

    // Gestión de progreso
    updateProgress: adminProcedure
      .input(z.object({
        studentId: z.number(),
        subject: z.string(),
        topic: z.string(),
        level: z.number().min(0).max(100),
      }))
      .mutation(async ({ input }) => {
        return db.updateProgress(input);
      }),

    // Gestión de acceso a herramientas PEO
    updateToolAccess: adminProcedure
      .input(z.object({
        studentId: z.number(),
        toolName: z.string(),
        accessCount: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.updateToolAccess(input);
      }),
  }),

  tizaia: router({
    sendMessage: protectedProcedure
      .input(z.object({
        message: z.string(),
        conversationHistory: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional(),
        attachments: z.array(z.object({
          type: z.enum(["text", "image"]),
          content: z.string(), // For text: the text content, for image: base64 data URL
          filename: z.string().optional(),
        })).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Import LLM helper
        const { invokeLLM } = await import("./_core/llm");
        
        // Get student profile
        const student = await db.getStudentByUserId(ctx.user.id);
        const studentName = ctx.user.name || "estudiante";
        const studentLevel = student?.level || "secundaria";
        const studentSubjects = student?.subjects || "matemática y física";
        
        // Build conversation history
        const messages: any[] = [
          {
            role: "system",
            content: `Eres TizaIA, el asistente educativo de ElProfeTino especializado en matemática y física para estudiantes de 7º grado a bachillerato en Uruguay.

Estás ayudando a ${studentName}, que cursa ${studentLevel} y estudia ${studentSubjects}.

Tu rol es EXPLICAR conceptos, procedimientos, fórmulas y teoría de manera clara y con ejemplos de la vida real (fútbol, cocina, skate, mate, etc.). 

REGLAS IMPORTANTES:
1. Dirígete al estudiante por su nombre: "¡Claro que sí, ${studentName}!" en lugar de "gurises"
2. Adapta tus explicaciones al nivel ${studentLevel}
3. NO resuelvas ejercicios completos - solo explica cómo abordarlos
4. Identifica qué conceptos y fórmulas se necesitan
5. Explica el procedimiento paso a paso sin dar la respuesta final
6. Da consejos y tips para evitar errores comunes
7. Al final, SIEMPRE recomienda practicar en GeneraTusEjercicios (GTE) bajo supervisión de ElProfeTino
8. Si te muestran una imagen de un ejercicio, explícalo pero NO lo resuelvas
9. Usa lenguaje cercano y motivador, adaptado a estudiantes uruguayos

Formato de respuesta:
- Saluda usando el nombre del estudiante
- Explica el concepto/tema principal adaptado a su nivel
- Lista las fórmulas relevantes
- Describe el procedimiento general
- Da consejos prácticos
- Recomienda practicar en GTE con ElProfeTino`
          }
        ];
        
        // Add conversation history
        if (input.conversationHistory) {
          messages.push(...input.conversationHistory);
        }
        
        // Build user message with attachments
        let userContent: any[] = [{ type: "text", text: input.message }];
        
        if (input.attachments && input.attachments.length > 0) {
          for (const attachment of input.attachments) {
            if (attachment.type === "image") {
              userContent.push({
                type: "image_url",
                image_url: { url: attachment.content }
              });
            } else if (attachment.type === "text") {
              userContent[0].text += `\n\n[Archivo adjunto: ${attachment.filename || "texto"}]\n${attachment.content}`;
            }
          }
        }
        
        messages.push({
          role: "user",
          content: userContent
        });
        
        // Call LLM
        const response = await invokeLLM({ messages });
        
        const assistantMessage = response.choices[0]?.message?.content || "Lo siento, no pude procesar tu consulta. Inténtalo de nuevo.";
        
        // Update tool access count
        if (student) {
          await db.updatePeoToolAccess(student.id, "TizaIA");
        }
        
        return {
          message: assistantMessage,
          timestamp: new Date().toISOString(),
        };
      }),
  }),
  
  // GeneraTusEjercicios router
  gte: router({
    generateExercises: protectedProcedure
      .input(z.object({
        topic: z.string(),
        level: z.string(),
        quantity: z.number().min(1).max(20),
        attachments: z.array(z.object({
          type: z.enum(["image", "text"]),
          content: z.string(),
          filename: z.string().optional(),
        })).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Get student profile
        const studentProfile = await db.getStudentByUserId(ctx.user.id);
        const studentName = ctx.user.name || "estudiante";
        const studentLevel = studentProfile?.level || input.level;
        
        const systemPrompt = `Eres GeneraTusEjercicios (GTE), un asistente educativo especializado en crear ejercicios de práctica para estudiantes de matemática y física.

Estás ayudando a ${studentName}, que cursa ${studentLevel}.

Tu objetivo es generar ejercicios adaptados al nivel del estudiante, con:
1. Enunciado claro y completo
2. Datos necesarios para resolver
3. Solución paso a paso detallada
4. Explicación de cada paso

FORMATO IMPORTANTE - Debes separar los ejercicios de las soluciones:

# EJERCICIOS

**Ejercicio 1:**
[Enunciado del ejercicio]

**Ejercicio 2:**
[Enunciado del ejercicio]

[... todos los ejercicios primero]

---

# SOLUCIONES

**Solución Ejercicio 1:**
Paso 1: [Explicación]
Paso 2: [Explicación]
...
Resultado final: [Respuesta]

**Solución Ejercicio 2:**
[Pasos detallados]

[... todas las soluciones después]

Recuerda: Los ejercicios deben ser variados pero del mismo tema y nivel de dificultad solicitado.`;

        const messages: any[] = [
          { role: "system", content: systemPrompt },
        ];
        
        // Build user message with attachments
        let userContent: any[] = [{
          type: "text",
          text: `Genera ${input.quantity} ejercicio(s) de práctica sobre: ${input.topic}\nNivel: ${input.level}`
        }];
        
        if (input.attachments && input.attachments.length > 0) {
          for (const attachment of input.attachments) {
            if (attachment.type === "image") {
              userContent.push({
                type: "image_url",
                image_url: { url: attachment.content }
              });
            } else if (attachment.type === "text") {
              userContent[0].text += `\n\n[Archivo adjunto: ${attachment.filename || "texto"}]\n${attachment.content}`;
            }
          }
        }
        
        messages.push({
          role: "user",
          content: userContent
        });
        
        // Call LLM
        const response = await invokeLLM({ messages });
        
        const exercises = response.choices[0]?.message?.content || "Lo siento, no pude generar los ejercicios. Inténtalo de nuevo.";
        
        // Update tool access count
        if (studentProfile) {
          await db.updatePeoToolAccess(studentProfile.id, "GeneraTusEjercicios");
        }
        
        return {
          exercises,
          timestamp: new Date().toISOString(),
        };
      }),
  }),
  
  // TuExamenPersonal router
  tep: router({
    // Generate structured exam with questions
    generateExam: protectedProcedure
      .input(z.object({
        topics: z.array(z.string()),
        duration: z.number().min(30).max(180),
        difficulty: z.string(),
        attachments: z.array(z.object({
          type: z.enum(["image", "text"]),
          content: z.string(),
          filename: z.string().optional(),
        })).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const student = await db.getStudentByUserId(ctx.user.id);
        if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Estudiante no encontrado" });
        
        const level = student.level || "secundaria";
        const subjectsRaw = student.subjects || "matemática, física";
        let subjects: string[];
        if (subjectsRaw === "ambas") {
          subjects = ["matemática", "física"];
        } else if (subjectsRaw.includes(",")) {
          subjects = subjectsRaw.split(",").map(s => s.trim());
        } else {
          subjects = [subjectsRaw];
        }
        
        // Generate structured exam using LLM
        const systemPrompt = `Eres TuExamenPersonal (TEP), un asistente educativo especializado en crear exámenes simulacro.

Información del estudiante:
- Nivel: ${level}
- Materias: ${subjects.join(", ")}
- Duración: ${input.duration} minutos
- Dificultad: ${input.difficulty}

Genera un examen con diferentes tipos de preguntas. Responde ÚNICAMENTE con un objeto JSON válido con esta estructura:

{
  "title": "Examen de [temas]",
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Texto de la pregunta",
      "options": ["a) Opción 1", "b) Opción 2", "c) Opción 3", "d) Opción 4"],
      "correctAnswer": "a",
      "points": 10,
      "topic": "Tema específico",
      "explanation": "Explicación de por qué es correcta"
    },
    {
      "type": "true_false",
      "question": "Afirmación a evaluar",
      "correctAnswer": "true",
      "points": 5,
      "topic": "Tema específico",
      "explanation": "Explicación"
    },
    {
      "type": "open_ended",
      "question": "Pregunta de desarrollo",
      "correctAnswer": "Respuesta esperada o criterios de evaluación",
      "points": 15,
      "topic": "Tema específico",
      "explanation": "Explicación detallada"
    }
  ]
}

Crea entre 8-12 preguntas variadas. Los puntos deben sumar aproximadamente 100.`;

        const messages: any[] = [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Genera un examen sobre: ${input.topics.join(", ")}` 
          }
        ];
        
        const response = await invokeLLM({ 
          messages,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "exam_structure",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["multiple_choice", "true_false", "open_ended"] },
                        question: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        correctAnswer: { type: "string" },
                        points: { type: "integer" },
                        topic: { type: "string" },
                        explanation: { type: "string" }
                      },
                      required: ["type", "question", "correctAnswer", "points", "topic", "explanation"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["title", "questions"],
                additionalProperties: false
              }
            }
          }
        });
        
        const content = response.choices[0]?.message?.content;
        const contentStr = typeof content === 'string' ? content : "{}";
        const examData = JSON.parse(contentStr);
        const totalPoints = examData.questions.reduce((sum: number, q: any) => sum + q.points, 0);
        
        // Create exam in database
        const examResult = await db.createExam({
          studentId: student.id,
          title: examData.title,
          topics: JSON.stringify(input.topics),
          duration: input.duration,
          difficulty: input.difficulty,
          totalPoints,
          status: "in_progress",
          startedAt: new Date(),
        });
        
        // Create questions
        const questions = examData.questions.map((q: any, index: number) => ({
          examId: examResult.examId,
          questionNumber: index + 1,
          type: q.type,
          question: q.question,
          options: q.options ? JSON.stringify(q.options) : null,
          correctAnswer: q.correctAnswer,
          points: q.points,
          topic: q.topic,
          explanation: q.explanation,
        }));
        
        await db.createExamQuestions(questions);
        
        // Update tool access
        await db.updatePeoToolAccess(student.id, "TuExamenPersonal");
        
        return {
          examId: examResult.examId,
          title: examData.title,
          duration: input.duration,
          totalPoints,
        };
      }),
    
    // Get exam details with questions
    getExam: protectedProcedure
      .input(z.object({ examId: z.number() }))
      .query(async ({ input, ctx }) => {
        const exam = await db.getExamById(input.examId);
        if (!exam) throw new TRPCError({ code: "NOT_FOUND", message: "Examen no encontrado" });
        
        const student = await db.getStudentByUserId(ctx.user.id);
        if (!student || exam.studentId !== student.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "No autorizado" });
        }
        
        const questions = await db.getQuestionsByExamId(input.examId);
        const answers = await db.getAnswersByExamId(input.examId);
        
        // Parse JSON fields
        const questionsWithParsed = questions.map(q => ({
          ...q,
          options: q.options ? JSON.parse(q.options) : null,
        }));
        
        return {
          exam: {
            ...exam,
            topics: JSON.parse(exam.topics),
          },
          questions: questionsWithParsed,
          answers,
        };
      }),
    
    // Save answer
    saveAnswer: protectedProcedure
      .input(z.object({
        examId: z.number(),
        questionId: z.number(),
        answer: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.saveExamAnswer({
          examId: input.examId,
          questionId: input.questionId,
          studentAnswer: input.answer,
          answeredAt: new Date(),
        });
        
        return { success: true };
      }),
    
    // Submit exam for evaluation
    submitExam: protectedProcedure
      .input(z.object({ examId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const exam = await db.getExamById(input.examId);
        if (!exam) throw new TRPCError({ code: "NOT_FOUND", message: "Examen no encontrado" });
        
        const student = await db.getStudentByUserId(ctx.user.id);
        if (!student || exam.studentId !== student.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "No autorizado" });
        }
        
        // Get questions and answers
        const questions = await db.getQuestionsByExamId(input.examId);
        const answers = await db.getAnswersByExamId(input.examId);
        
        // Evaluate answers
        let totalEarned = 0;
        const topicScores: Record<string, { correct: number, total: number }> = {};
        const incorrectAnswers: any[] = [];
        
        for (const question of questions) {
          const answer = answers.find(a => a.questionId === question.id);
          if (!answer) continue;
          
          let isCorrect = 0;
          let pointsEarned = 0;
          
          if (question.type === "multiple_choice" || question.type === "true_false") {
            // Exact match for MC and T/F
            isCorrect = answer.studentAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim() ? 1 : 0;
            pointsEarned = isCorrect ? question.points : 0;
          } else {
            // For open-ended, give partial credit (50%) if answered
            isCorrect = answer.studentAnswer && answer.studentAnswer.trim().length > 10 ? 1 : 0;
            pointsEarned = isCorrect ? Math.floor(question.points * 0.5) : 0;
          }
          
          // Track incorrect answers for feedback
          if (!isCorrect || pointsEarned < question.points) {
            incorrectAnswers.push({
              questionNumber: question.questionNumber,
              question: question.question,
              studentAnswer: answer.studentAnswer || "(Sin respuesta)",
              correctAnswer: question.correctAnswer,
              explanation: question.explanation || "Revisa este tema en tus apuntes o consulta con TizaIA.",
              pointsLost: question.points - pointsEarned,
            });
          }
          
          await db.updateAnswerEvaluation(answer.id, isCorrect, pointsEarned);
          totalEarned += pointsEarned;
          
          // Track by topic
          if (!topicScores[question.topic]) {
            topicScores[question.topic] = { correct: 0, total: 0 };
          }
          topicScores[question.topic].total += question.points;
          topicScores[question.topic].correct += pointsEarned;
        }
        
        // Calculate percentage
        const percentage = Math.round((totalEarned / exam.totalPoints) * 100);
        
        // Generate weak topics list
        const weakTopics = Object.entries(topicScores)
          .map(([topic, scores]) => ({
            topic,
            score: Math.round((scores.correct / scores.total) * 100),
          }))
          .sort((a, b) => a.score - b.score);
        
        // Generate recommendations using LLM
        const recommendationPrompt = `Basándote en los resultados del examen:
- Puntos obtenidos: ${totalEarned}/${exam.totalPoints} (${percentage}%)
- Temas débiles: ${weakTopics.map(t => `${t.topic}: ${t.score}%`).join(", ")}

Genera recomendaciones breves y específicas (máximo 3 párrafos) sobre qué temas debe practicar el estudiante, priorizando los más débiles.`;
        
        const recResponse = await invokeLLM({
          messages: [
            { role: "system", content: "Eres un tutor educativo que da recomendaciones constructivas." },
            { role: "user", content: recommendationPrompt }
          ]
        });
        
        const recContent = recResponse.choices[0]?.message?.content;
        const recommendations = typeof recContent === 'string' ? recContent : "Continúa practicando los temas del examen.";
        
        // Save result
        await db.createExamResult({
          examId: input.examId,
          studentId: student.id,
          totalPoints: exam.totalPoints,
          pointsEarned: totalEarned,
          percentage,
          weakTopics: JSON.stringify(weakTopics),
          recommendations,
        });
        
        // Update exam status
        await db.updateExamStatus(input.examId, "completed", new Date());
        
        return {
          totalPoints: exam.totalPoints,
          pointsEarned: totalEarned,
          percentage,
          weakTopics,
          recommendations,
          incorrectAnswers,
        };
      }),
    
    // Get exam result
    getResult: protectedProcedure
      .input(z.object({ examId: z.number() }))
      .query(async ({ input, ctx }) => {
        const result = await db.getResultByExamId(input.examId);
        if (!result) throw new TRPCError({ code: "NOT_FOUND", message: "Resultado no encontrado" });
        
        const student = await db.getStudentByUserId(ctx.user.id);
        if (!student || result.studentId !== student.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "No autorizado" });
        }
        
        return {
          ...result,
          weakTopics: JSON.parse(result.weakTopics || "[]"),
        };
      }),
    
    // Get student's exam history
    getExamHistory: protectedProcedure
      .query(async ({ ctx }) => {
        const student = await db.getStudentByUserId(ctx.user.id);
        if (!student) return [];
        
        const exams = await db.getExamsByStudentId(student.id);
        const results = await db.getResultsByStudentId(student.id);
        
        return exams
          .filter(exam => exam.status === "completed")
          .map(exam => {
            const result = results.find(r => r.examId === exam.id);
            return {
              id: exam.id,
              title: exam.title,
              topics: exam.topics,
              duration: exam.duration,
              difficulty: exam.difficulty,
              totalPoints: exam.totalPoints,
              status: exam.status,
              completedAt: exam.completedAt,
              createdAt: exam.createdAt,
              percentage: result?.percentage || 0,
              pointsEarned: result?.pointsEarned || 0,
            };
          })
          .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime());
      }),
  }),
});

export type AppRouter = typeof appRouter;
