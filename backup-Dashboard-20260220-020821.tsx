import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { 
  Calendar, 
  TrendingUp, 
  FileText, 
  Brain, 
  PenTool, 
  FileCheck, 
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as BigCalendar, dateFnsLocalizer, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";

// Configurar localizer para el calendario
const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Lunes como primer día
  getDay,
  locales,
});

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [, navigate] = useLocation();
  
  const { data: student, isLoading: studentLoading } = trpc.dashboard.getStudent.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const { data: upcomingClasses = [], isLoading: classesLoading } = trpc.dashboard.getUpcomingClasses.useQuery(undefined, {
    enabled: isAuthenticated && !!student,
  });
  
  const { data: progress = [], isLoading: progressLoading } = trpc.dashboard.getProgress.useQuery(undefined, {
    enabled: isAuthenticated && !!student,
  });
  
  const { data: assignments = [], isLoading: assignmentsLoading } = trpc.dashboard.getPendingAssignments.useQuery(undefined, {
    enabled: isAuthenticated && !!student,
  });
  
  const { data: peoAccess = [], isLoading: peoLoading } = trpc.dashboard.getPeoToolAccess.useQuery(undefined, {
    enabled: isAuthenticated && !!student,
  });
  
  const { data: examHistory = [], isLoading: examHistoryLoading } = trpc.tep.getExamHistory.useQuery(undefined, {
    enabled: isAuthenticated && !!student,
  });

  if (authLoading || studentLoading) {
    return (
      <div ) className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-muted-foreground">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div ) className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-display font-bold">Acceso Restringido</h2>
          <p className="text-muted-foreground">
            Necesitas iniciar sesión para acceder a tu dashboard de estudiante.
          </p>
          <Button 
            className="w-full glow-cyan"
            style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}
            asChild
          >
            <a href={getLoginUrl()}>Iniciar Sesión</a>
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Volver al Inicio
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div ) className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center space-y-6">
          <div className="text-6xl">📚</div>
          <h2 className="text-2xl font-display font-bold">Perfil de Estudiante No Encontrado</h2>
          <p className="text-muted-foreground">
            Aún no tienes un perfil de estudiante. Contacta a ElProfeTino para configurar tu cuenta.
          </p>
          <Button 
            className="w-full glow-green"
            style={{ backgroundColor: '#00ff88', color: '#0a1628' }}
            asChild
          >
            <a href="https://wa.me/59898175225?text=Hola,%20necesito%20configurar%20mi%20perfil%20de%20estudiante" target="_blank" rel="noopener noreferrer">
              Contactar por WhatsApp
            </a>
          </Button>
        </Card>
      </div>
    );
  }

  const calculateOverallProgress = () => {
    if (progress.length === 0) return 0;
    const total = progress.reduce((sum, p) => sum + p.level, 0);
    return Math.round(total / progress.length);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-display font-bold cursor-pointer">
                <span className="text-foreground">ElProfe</span>
                <span className="text-glow-cyan" style={{ color: '#00d4ff' }}>Tino</span>
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center font-bold text-lg" style={{ color: '#00d4ff' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            ¡Hola, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-lg text-muted-foreground">
            Aquí está tu progreso y próximas actividades
          </p>
        </div>

        {/* Stats Overview */}
                {/* Stats Overview - Clickeable con UX Pro */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card 
            onClick={() => document.getElementById("progress-section")?.scrollIntoView({ behavior: "smooth" })}
            className="p-6 border-glow-cyan bg-card/50 backdrop-blur-sm space-y-2 cursor-pointer hover:scale-105 hover:shadow-2xl active:scale-95 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <TrendingUp className="w-8 h-8 group-hover:rotate-12 transition-transform" style={{ color: '#00d4ff' }} />
              <span className="text-3xl font-mono font-bold" style={{ color: '#00d4ff' }}>{overallProgress}%</span>
            </div>
            <p className="text-sm font-semibold">Progreso General</p>
            <p className="text-xs text-muted-foreground">Ver detalle completo →</p>
          </div></Card>

          <Card 
            onClick={() => setShowBookingModal(true)}
            className="p-6 border-glow-green bg-card/50 backdrop-blur-sm space-y-2 cursor-pointer hover:scale-105 hover:shadow-2xl active:scale-95 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <Calendar className="w-8 h-8 group-hover:rotate-12 transition-transform" style={{ color: '#00ff88' }} />
              <span className="text-3xl font-mono font-bold" style={{ color: '#00ff88' }}>{upcomingClasses.length}</span>
            </div>
            <p className="text-sm font-semibold">Clases Próximas</p>
            <p className="text-xs text-muted-foreground">Reservar nueva clase →</p>
          </Card>

          <Card 
            onClick={() => navigate("/generatusejercicios")}
            className="p-6 border-glow-gold bg-card/50 backdrop-blur-sm space-y-2 cursor-pointer hover:scale-105 hover:shadow-2xl active:scale-95 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <FileText className="w-8 h-8 group-hover:rotate-12 transition-transform" style={{ color: '#ffd700' }} />
              <span className="text-3xl font-mono font-bold" style={{ color: '#ffd700' }}>{assignments.length}</span>
            </div>
            <p className="text-sm font-semibold">Ejercicios Pendientes</p>
            <p className="text-xs text-muted-foreground">Practicar ahora →</p>
          </Card>

          <Card 
            onClick={() => navigate("/tuexamenpersonal")}
            className="p-6 border-border bg-card/50 backdrop-blur-sm space-y-2 cursor-pointer hover:scale-105 hover:shadow-2xl active:scale-95 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" style={{ color: '#ff6b35' }} />
              <span className="text-3xl font-mono font-bold" style={{ color: '#ff6b35' }}>{progress.length}</span>
            </div>
            <p className="text-sm font-semibold">Temas Estudiados</p>
            <p className="text-xs text-muted-foreground">Hacer examen →</p>
          </Card>
        </div>
            <p className="text-sm font-semibold">Progreso General</p>
          </Card>

          <Card className="p-6 border-glow-green bg-card/50 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <Calendar className="w-8 h-8" style={{ color: '#00ff88' }} />
              <span className="text-3xl font-mono font-bold" style={{ color: '#00ff88' }}>{upcomingClasses.length}</span>
            </div>
            <p className="text-sm font-semibold">Clases Próximas</p>
          </Card>

          <Card className="p-6 border-glow-gold bg-card/50 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <FileText className="w-8 h-8" style={{ color: '#ffd700' }} />
              <span className="text-3xl font-mono font-bold" style={{ color: '#ffd700' }}>{assignments.length}</span>
            </div>
            <p className="text-sm font-semibold">Ejercicios Pendientes</p>
          </Card>

          <Card className="p-6 border-border bg-card/50 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <Sparkles className="w-8 h-8" style={{ color: '#ff6b35' }} />
              <span className="text-3xl font-mono font-bold" style={{ color: '#ff6b35' }}>{progress.length}</span>
            </div>
            <p className="text-sm font-semibold">Temas Estudiados</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Upcoming Classes with Calendar View */}
            <Card className="p-6 border-glow-cyan bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" style={{ color: '#00d4ff' }} />
                  <h3 className="text-2xl font-display font-bold">Próximas Clases</h3>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCalendarView(!showCalendarView)}
                    className="gap-2"
                  >
                    {showCalendarView ? 'Ver Lista' : 'Ver Calendario'}
                  </Button>
                  <Button 
                    size="sm"
                    className="glow-green gap-2"
                    style={{ backgroundColor: '#00ff88', color: '#0a1628' }}
                    onClick={() => setShowBookingModal(true)}
                  >
                    + Reservar Clase
                  </Button>
                </div>
              </div>
              
              {classesLoading ? (
                <div ) className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                </div>
              ) : upcomingClasses.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No tienes clases programadas</p>
                </div>
              ) : showCalendarView ? (
                <div className="h-[500px]">
                  <BigCalendar
                    localizer={localizer}
                    events={upcomingClasses.map(clase => ({
                      title: `${clase.subject}${clase.topic ? ` - ${clase.topic}` : ''}`,
                      start: new Date(clase.scheduledAt),
                      end: new Date(new Date(clase.scheduledAt).getTime() + (clase.duration || 60) * 60000),
                      resource: clase,
                    }))}
                    startAccessor="start"
                    endAccessor="end"
                    culture="es"
                    messages={{
                      next: "Siguiente",
                      previous: "Anterior",
                      today: "Hoy",
                      month: "Mes",
                      week: "Semana",
                      day: "Día",
                      agenda: "Agenda",
                      date: "Fecha",
                      time: "Hora",
                      event: "Clase",
                      noEventsInRange: "No hay clases en este rango",
                    }}
                    style={{ height: '100%' }}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingClasses.slice(0, 5).map((clase) => (
                    <div key={clase.id} className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5" style={{ color: '#00d4ff' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold capitalize">{clase.subject}</p>
                        {clase.topic && <p ) className="text-sm text-muted-foreground">{clase.topic}</p>}
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(clase.scheduledAt), "EEEE d 'de' MMMM, HH:mm", { locale: es })}
                        </p>
                      </div>
                      <div className="text-sm font-mono" style={{ color: '#00d4ff' }}>
                        {clase.duration} min
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Pending Assignments */}
            <Card className="p-6 border-glow-gold bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6" style={{ color: '#ffd700' }} />
                <h3 className="text-2xl font-display font-bold">Ejercicios Pendientes</h3>
              </div>
              
              {assignmentsLoading ? (
                <div ) className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                  <p className="text-muted-foreground">¡Todo al día! No tienes ejercicios pendientes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.slice(0, 5).map((assignment) => (
                    <div key={assignment.id} className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5" style={{ color: '#ffd700' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold capitalize">{assignment.subject} - {assignment.topic}</p>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        {assignment.dueDate && (
                          <p ) className="text-sm mt-1 flex items-center gap-1" style={{ color: '#ffd700' }}>
                            <AlertCircle className="w-4 h-4" />
                            Vence: {format(new Date(assignment.dueDate), "d 'de' MMMM", { locale: es })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Progress by Topic */}
            <Card id="progress-section" className="p-6 border-glow-green bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6" style={{ color: '#00ff88' }} />
                <h3 className="text-2xl font-display font-bold">Tu Progreso</h3>
              </div>
              
              {progressLoading ? (
                <div ) className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                </div>
              ) : progress.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Aún no hay progreso registrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {progress.slice(0, 8).map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold capitalize">
                          {item.subject} - {item.topic}
                        </p>
                        <span className="text-sm font-mono font-bold" style={{ color: '#00ff88' }}>
                          {item.level}%
                        </span>
                      </div>
                      <Progress value={item.level} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Exam History */}
            <Card className="p-6 border-glow-gold bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-6 h-6" style={{ color: '#ffd700' }} />
                <h3 className="text-2xl font-display font-bold">Historial de Exámenes</h3>
              </div>
              
              {examHistoryLoading ? (
                <div ) className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                </div>
              ) : examHistory.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <FileCheck className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Aún no has realizado exámenes</p>
                  <Link href="/tuexamenpersonal">
                    <Button size="sm" className="glow-gold mt-4" style={{ backgroundColor: '#ffd700', color: '#0a1628' }}>
                      Hacer mi primer examen
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {examHistory.slice(0, 5).map((exam: any) => (
                    <div key={exam.id} className="p-4 rounded-lg bg-background/50 border border-border space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{exam.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(exam.completedAt || exam.createdAt), "d 'de' MMMM, HH:mm", { locale: es })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold font-mono ${
                            exam.percentage >= 70 ? 'text-green-500' : 
                            exam.percentage >= 50 ? 'text-yellow-500' : 
                            'text-red-500'
                          }`}>
                            {exam.percentage}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {exam.pointsEarned}/{exam.totalPoints} pts
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {exam.topics.split(',').map((topic: string, idx: number) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full bg-muted">
                            {topic.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {examHistory.length > 5 && (
                    <Link href="/tuexamenpersonal">
                      <Button variant="outline" size="sm" ) className="w-full">
                        Ver todos los exámenes
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </Card>

            {/* PEO Tools Access */}
            <Card className="p-6 border-border bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" style={{ color: '#00d4ff' }} />
                <h3 className="text-2xl font-display font-bold">Herramientas PEO</h3>
              </div>
              
              <div className="grid gap-4">
                <Link href="/tizaia">
                  <Card className="p-4 border-glow-cyan bg-background/50 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Brain className="w-6 h-6" style={{ color: '#00d4ff' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">TizaIA</p>
                        <p className="text-xs text-muted-foreground">Asistente educativo 24/7</p>
                      </div>
                      <Button size="sm" className="glow-cyan" style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}>
                        Abrir
                      </Button>
                    </div>
                  </Card>
                </Link>

                <Link href="/generatusejercicios">
                  <Card className="p-4 border-glow-green bg-background/50 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <PenTool className="w-6 h-6" style={{ color: '#00ff88' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">GeneraTusEjercicios</p>
                        <p className="text-xs text-muted-foreground">Práctica ilimitada</p>
                      </div>
                      <Button size="sm" className="glow-green" style={{ backgroundColor: '#00ff88', color: '#0a1628' }}>
                        Abrir
                      </Button>
                    </div>
                  </Card>
                </Link>

                <Link href="/tuexamenpersonal">
                  <Card className="p-4 border-glow-gold bg-background/50 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <FileCheck className="w-6 h-6" style={{ color: '#ffd700' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">TuExamenPersonal</p>
                        <p className="text-xs text-muted-foreground">Simulá el examen</p>
                      </div>
                      <Button size="sm" className="glow-gold" style={{ backgroundColor: '#ffd700', color: '#0a1628' }}>
                        Abrir
                      </Button>
                    </div>
                  </Card>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal open={showBookingModal} onOpenChange={setShowBookingModal} />
    </div>
  );
}


