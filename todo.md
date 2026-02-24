# ElProfeTino Landing - TODO

## Completado
- [x] Página principal con hero section
- [x] Sección de historia de marca
- [x] Tarjetas de herramientas PEO
- [x] Cuponeras 2026
- [x] Prueba social con resultados de febrero
- [x] Formulario de contacto
- [x] Footer
- [x] SEO optimizado (título, meta descripción, keywords)
- [x] Sitemap.xml y robots.txt
- [x] Imagen de previsualización para redes sociales
- [x] Chatbot interactivo con FAQ
- [x] Sección de testimonios/reseñas
- [x] Google Maps integrado
- [x] Páginas individuales para herramientas PEO (TizaIA, GeneraTusEjercicios, TuExamenPersonal)
- [x] Actualización de precios en chatbot
- [x] Actualización de horarios de atención

## En Progreso
- [ ] Descarga de ejercicios en PDF en GTE
- [ ] Descarga de exámenes en PDF en TEP

## Completado Recientemente
- [x] Upgrade a web-db-user (backend + database + auth)
- [x] Diseño de esquema de base de datos para estudiantes
- [x] Dashboard de estudiantes con progreso
- [x] Sistema de clases y asignaciones
- [x] Acceso a herramientas PEO desde dashboard
- [x] Integración de autenticación con Manus OAuth
- [x] Procedimientos tRPC para dashboard
- [x] Botón de acceso al dashboard en página principal
- [x] Corrección de error cuando usuario no tiene registro de estudiante
- [x] Manejo de casos sin estudiante asociado en procedimientos tRPC
- [x] UI del dashboard muestra estado apropiado cuando no hay datos
- [x] Script de seeding para crear datos de prueba
- [x] Perfil de estudiante de prueba creado para usuario admin
- [x] Datos de ejemplo agregados: 4 clases, 6 temas con progreso, 3 ejercicios, 3 herramientas PEO
- [x] Título de la página principal optimizado para SEO (56 caracteres)
- [x] Datos estructurados schema.org/Course en TizaIA
- [x] Datos estructurados schema.org/Course en GeneraTusEjercicios
- [x] Datos estructurados schema.org/Course en TuExamenPersonal
- [x] Títulos dinámicos optimizados para todas las páginas de herramientas
- [x] Sitemap.xml dinámico generado automáticamente
- [x] Endpoint /sitemap.xml configurado en el servidor
- [x] Guía completa para Google Search Console creada
- [x] Panel de administración en /admin implementado
- [x] Procedimientos tRPC para operaciones de administración (CRUD estudiantes, clases, ejercicios, progreso)
- [x] Gestión de estudiantes (crear, editar, listar, eliminar)
- [x] Gestión de clases (programar, editar, cancelar)
- [x] Asignación de ejercicios desde panel admin
- [x] Actualización de progreso y acceso a herramientas PEO
- [x] Control de acceso: solo usuarios con rol admin
- [x] Tests unitarios completos para panel de administración (9/9 pasando)
- [x] Header global con navegación (Dashboard, Perfil, Admin)
- [x] Enlace al panel admin en header (solo visible para admins)
- [x] Calendario visual en dashboard del estudiante (react-big-calendar)
- [x] Vista de lista y calendario intercambiable en dashboard
- [x] Página de perfil de usuario en /profile
- [x] Formulario de edición de información personal (teléfono, nivel, materias)
- [x] Problema de despliegue diagnosticado (botón Mi Dashboard condicional a autenticación)
- [x] Sistema de reserva de clases implementado
- [x] Procedimientos tRPC para gestión de reservas (getAvailableSlots, bookClass)
- [x] Componente BookingModal con selección de fecha, hora, materia y tema
- [x] Validación de disponibilidad y prevención de conflictos de horario
- [x] Integración del sistema de reservas en el dashboard del estudiante
- [x] Tests unitarios completos para sistema de reservas (5/5 pasando)
- [x] Campo "institución" agregado al esquema de base de datos
- [x] Migración de base de datos aplicada (pnpm db:push)
- [x] Formulario de creación de estudiante mejorado con selector de usuarios
- [x] Campo institución con opciones (Liceo, UTU, Liceo Militar, Magisterio, Escuela Policía, Otros)
- [x] Procedimiento tRPC listUsers agregado
- [x] Funciones de base de datos actualizadas para incluir institución
- [x] TizaIA interactiva implementada con chat de IA
- [x] Procedimiento tRPC tizaia.sendMessage creado
- [x] Integración con LLM (invokeLLM) para respuestas de IA
- [x] Prompt especializado configurado (explicar sin resolver, recomendar GTE)
- [x] Componente TizaIAChat con interfaz de chat completa
- [x] Carga de archivos de texto e imágenes implementada
- [x] Preview de archivos adjuntos antes de enviar
- [x] Descarga de conversaciones en TXT funcional
- [x] Descarga de conversaciones en PDF (próximamente)
- [x] Historial de conversación con Streamdown para markdown
- [x] Actualización automática de contador de acceso a TizaIA
- [x] Control de acceso: solo usuarios autenticados
- [x] Diseño espacial coherente con el resto del sitio
- [x] GeneraTusEjercicios (GTE) implementada con IA
- [x] Procedimiento tRPC gte.generateExercises creado
- [x] Generación de ejercicios con soluciones paso a paso
- [x] Componente GTEChat con interfaz completa
- [x] Carga de archivos de texto e imágenes en GTE
- [x] Captura de fotos con cámara en GTE
- [x] Preview de archivos adjuntos en GTE
- [x] Descarga de ejercicios en TXT funcional
- [x] Sistema universal de carga de archivos (FileUploadWithCamera)
- [x] Miniaturas de archivos adjuntos en todas las herramientas
- [x] TuExamenPersonal (TEP) implementada con IA
- [x] Procedimiento tRPC tep.generateExam creado
- [x] Generación de exámenes simulacro personalizados
- [x] Componente TEPChat con interfaz completa
- [x] Selección de temas para exámenes (input manual + badges)
- [x] Configuración de duración y dificultad del examen
- [x] Carga de archivos y captura de fotos en TEP
- [x] Descarga de exámenes en TXT funcional
- [x] Control de acceso: solo usuarios autenticados en TEP
- [x] Personalización según nivel y materias del estudiante

## Pendiente
- [ ] Sección de biografías de científicos
- [ ] Optimización de imágenes y performance
- [ ] Tests automatizados

## Completado - TuExamenPersonal (TEP) Mejorado

### Modo Examen Real
- [x] Ocultar soluciones durante el examen
- [x] Cronómetro regresivo visible
- [x] Alertas visuales a los 10 y 5 minutos antes de finalizar
- [x] Botón "Finalizar Examen" para entregar antes del tiempo

### Tipos de Preguntas
- [x] Preguntas de múltiple opción (radio buttons)
- [x] Preguntas Verdadero/Falso
- [x] Preguntas de respuesta abierta (textarea)
- [x] Espacios para que el estudiante responda cada pregunta

### Sistema de Evaluación
- [x] Evaluación automática al finalizar el tiempo o presionar botón
- [x] Cálculo de puntos obtenidos
- [x] Cálculo de porcentaje de aciertos
- [x] Generación de reporte con recomendaciones de temas a practicar (ordenados por prioridad)
- [x] Recomendaciones personalizadas generadas por IA

### Base de Datos
- [x] Tabla para almacenar exámenes realizados (exams)
- [x] Tabla para almacenar preguntas (exam_questions)
- [x] Tabla para almacenar respuestas del estudiante (student_answers)
- [x] Tabla para almacenar resultados y evaluaciones (exam_results)

### Dashboard del Estudiante
- [x] Sección de historial de exámenes
- [x] Visualización de resultados (puntos, porcentaje)
- [x] Lista de temas recomendados para practicar
- [x] Indicadores de color según rendimiento (verde/amarillo/rojo)

## Renderizado Matemático Profesional - En Progreso

### Implementación de KaTeX
- [x] Instalar KaTeX y dependencias
- [x] Configurar estilos CSS de KaTeX
- [x] Crear componente MathRenderer

### Integración en Herramientas PEO
- [x] TizaIA: Componente MathRenderer integrado
- [x] GeneraTusEjercicios: Componente MathRenderer integrado
- [x] TuExamenPersonal: Componente MathRenderer integrado

### Problema Identificado
- [ ] El backend escapa caracteres especiales (\_ en lugar de _)
- [ ] Esto rompe el patrón regex para detectar fórmulas LaTeX
- [ ] Necesita ajuste en el prompt del backend o procesamiento adicional

### Pendiente
- [ ] Modificar prompts del backend para generar LaTeX sin escape
- [ ] O implementar des-escape más robusto en MathRenderer
- [ ] Probar con fórmulas complejas: fracciones, exponentes, símbolos griegos

## Completado - Personalización y Mejoras en Herramientas PEO

### 1. Personalización por Estudiante en las 3 Herramientas
- [x] TizaIA: Saludar con nombre del estudiante en lugar de "gurises"
- [x] TizaIA: Responder según curso y nivel del estudiante
- [x] GTE: Generar ejercicios adaptados al curso y nivel del estudiante
- [x] GTE: Usar nombre del estudiante en las respuestas
- [x] TEP: Personalizar exámenes según curso y materias del estudiante
- [x] Todas las herramientas acceden al perfil completo del estudiante

### 2. Mejoras en GeneraTusEjercicios (GTE)
- [x] Separar ejercicios de soluciones en la respuesta
- [x] Mostrar primero todos los ejercicios
- [x] Mostrar soluciones después de los ejercicios
- [x] Opción de descarga: Solo preguntas (TXT)
- [x] Opción de descarga: Preguntas + Soluciones (TXT)
- [x] Botones separados para cada tipo de descarga
- [ ] Opción de descarga en PDF (pendiente)

### 3. Mejoras en TuExamenPersonal (TEP)
- [x] Mostrar respuestas correctas en preguntas incorrectas
- [x] Indicar qué debería haber respondido el estudiante
- [x] Mostrar explicaciones de respuestas incorrectas
- [x] Recomendar practicar temas flojos con GTE
- [x] Recomendar consultar dudas con TizaIA
- [x] Sugerir clase presencial con ElProfeTino
- [x] Botón "Reservar Clase Presencial" por WhatsApp con temas pre-cargados
- [x] Backend incluye incorrectAnswers en el resultado

## Pendiente - Sistema de Ejercicios y Dashboard Interactivo

### 4. Dashboard Interactivo del Estudiante
- [ ] Hacer clickeables las 4 boxes principales:
  * Progreso General → Vista detallada de progreso
  * Clases Próximas → Lista de clases programadas
  * Ejercicios Pendientes → Lista de ejercicios asignados
  * Temas Estudiados → Historial de temas vistos
- [ ] Página "Ejercicios Pendientes" con lista completa
- [ ] Click en ejercicio pendiente → GTE con tema pre-cargado
- [ ] Sistema de ejercicios asignados por el admin
- [ ] Subir respuestas (foto/archivo) desde el dashboard
- [ ] Enviar respuestas para corrección del profesor

### 5. Sistema de Entrega y Corrección de Tareas
- [ ] Tabla en BD para ejercicios asignados
- [ ] Tabla en BD para respuestas subidas por estudiantes
- [ ] Interfaz para subir archivos/fotos de respuestas
- [ ] Notificación al admin cuando hay tareas para corregir
- [ ] Dashboard del admin: Sección "Para Corregir"
- [ ] Interfaz de corrección para el admin
- [ ] Sistema de calificación y feedback
- [ ] Notificación al estudiante cuando la tarea está corregida
