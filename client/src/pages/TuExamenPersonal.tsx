import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Clock, X, AlertCircle, CheckCircle2, TrendingUp, Download, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { FileUploadWithCamera } from "@/components/FileUploadWithCamera";
import { MathRenderer } from "@/components/MathRenderer";
import { Link } from "wouter";

type ExamState = "config" | "in_progress" | "completed";
type QuestionType = "multiple_choice" | "true_false" | "open_ended";

interface Question {
  id: number;
  questionNumber: number;
  type: QuestionType;
  question: string;
  options: string[] | null;
  points: number;
  topic: string;
}

interface Answer {
  questionId: number;
  answer: string;
}

export default function TuExamenPersonal() {
  const { user, loading, isAuthenticated } = useAuth();
  const [examState, setExamState] = useState<ExamState>("config");
  
  // Configuration state
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [duration, setDuration] = useState(90);
  const [difficulty, setDifficulty] = useState("intermedio");
  const [attachments, setAttachments] = useState<Array<{ type: "image" | "text", content: string, filename?: string }>>([]);
  
  // Exam state
  const [examId, setExamId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  
  // Result state
  const [result, setResult] = useState<any>(null);
  
  const generateExamMutation = trpc.tep.generateExam.useMutation();
  const getExamQuery = trpc.tep.getExam.useQuery(
    { examId: examId! },
    { enabled: !!examId && examState === "in_progress" }
  );
  const saveAnswerMutation = trpc.tep.saveAnswer.useMutation();
  const submitExamMutation = trpc.tep.submitExam.useMutation();
  const getResultQuery = trpc.tep.getResult.useQuery(
    { examId: examId! },
    { enabled: !!examId && examState === "completed" }
  );
  
  // Timer effect
  useEffect(() => {
    if (examState !== "in_progress" || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // Show warnings
        if (newTime === 600 || newTime === 300) {
          const minutes = Math.floor(newTime / 60);
          toast.warning(`⏰ Quedan ${minutes} minutos`, {
            description: "Revisa tus respuestas",
          });
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 3000);
        }
        
        // Auto-submit when time runs out
        if (newTime === 0) {
          handleSubmitExam();
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [examState, timeRemaining]);
  
  // Load exam data
  useEffect(() => {
    if (getExamQuery.data && examState === "in_progress") {
      setQuestions(getExamQuery.data.questions);
      // Load existing answers
      const existingAnswers: Record<number, string> = {};
      getExamQuery.data.answers.forEach((a: any) => {
        if (a.studentAnswer) {
          existingAnswers[a.questionId] = a.studentAnswer;
        }
      });
      setAnswers(existingAnswers);
    }
  }, [getExamQuery.data, examState]);
  
  // Load result
  useEffect(() => {
    if (getResultQuery.data && examState === "completed") {
      setResult(getResultQuery.data);
    }
  }, [getResultQuery.data, examState]);
  
  const handleAddTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      setTopics([...topics, topicInput.trim()]);
      setTopicInput("");
    }
  };
  
  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };
  
  const handleGenerateExam = async () => {
    if (topics.length === 0) {
      toast.error("Agrega al menos un tema");
      return;
    }
    
    try {
      const result = await generateExamMutation.mutateAsync({
        topics,
        duration,
        difficulty,
        attachments,
      });
      
      setExamId(result.examId);
      setTimeRemaining(duration * 60);
      setExamState("in_progress");
      toast.success("¡Examen generado! Comienza ahora");
    } catch (error) {
      toast.error("Error al generar el examen");
      console.error(error);
    }
  };
  
  const handleAnswerChange = async (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Auto-save answer
    if (examId) {
      try {
        await saveAnswerMutation.mutateAsync({
          examId,
          questionId,
          answer,
        });
      } catch (error) {
        console.error("Error saving answer:", error);
      }
    }
  };
  
  const handleSubmitExam = async () => {
    if (!examId) return;
    
    try {
      const result = await submitExamMutation.mutateAsync({ examId });
      setResult(result);
      setExamState("completed");
      toast.success("¡Examen enviado!");
    } catch (error) {
      toast.error("Error al enviar el examen");
      console.error(error);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  const handleDownloadTXT = () => {
    if (!result || !getExamQuery.data) return;
    
    let content = `RESULTADO DEL EXAMEN\n`;
    content += `======================\n\n`;
    content += `Puntos: ${result.pointsEarned}/${result.totalPoints} (${result.percentage}%)\n\n`;
    content += `TEMAS A PRACTICAR:\n`;
    result.weakTopics.forEach((t: any, i: number) => {
      content += `${i + 1}. ${t.topic} - ${t.score}%\n`;
    });
    content += `\n\nRECOMENDACIONES:\n${result.recommendations}\n`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resultado-examen-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center space-y-6">
          <AlertCircle className="w-16 h-16 mx-auto text-yellow-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Acceso Restringido</h2>
            <p className="text-muted-foreground">
              Necesitas iniciar sesión para acceder a TuExamenPersonal
            </p>
          </div>
          <Button asChild className="w-full">
            <a href={getLoginUrl()}>Iniciar Sesión</a>
          </Button>
        </Card>
      </div>
    );
  }
  
  // Configuration screen
  if (examState === "config") {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              TuExamenPersonal
            </h1>
            <h2 className="text-2xl font-semibold text-glow-cyan" style={{ color: "#00d4ff" }}>
              Simulacros Personalizados
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Genera exámenes simulacro adaptados a tu nivel y materias. Selecciona los temas que quieres practicar, duración y dificultad.
            </p>
          </div>
          
          <Card className="p-8 space-y-6 bg-card/50 backdrop-blur-sm">
            {/* Topics */}
            <div className="space-y-3">
              <Label htmlFor="topic">Temas del examen</Label>
              <div className="flex gap-2">
                <Input
                  id="topic"
                  placeholder="Ej: Ecuaciones de segundo grado, Cinemática..."
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                />
                <Button onClick={handleAddTopic} type="button">+</Button>
              </div>
              {topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-sm">
                      {topic}
                      <button
                        onClick={() => handleRemoveTopic(topic)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Duration */}
            <div className="space-y-3">
              <Label htmlFor="duration">Duración (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min={30}
                max={180}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
            
            {/* Difficulty */}
            <div className="space-y-3">
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* File upload */}
            <div className="space-y-3">
              <Label>Archivos de referencia (opcional)</Label>
              <FileUploadWithCamera
                onFilesSelected={setAttachments}
                maxFiles={5}
              />
            </div>
            
            {/* Generate button */}
            <Button
              onClick={handleGenerateExam}
              disabled={generateExamMutation.isPending || topics.length === 0}
              className="w-full text-lg py-6 glow-green animate-pulse-glow font-semibold"
              style={{ backgroundColor: "#00ff88", color: "#0a1628" }}
            >
              {generateExamMutation.isPending ? "Generando..." : "Generar Examen Simulacro"}
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  // Exam in progress
  if (examState === "in_progress") {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Timer header */}
          <Card className={`p-6 sticky top-4 z-10 ${showWarning ? "border-yellow-500 border-2 animate-pulse" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6" />
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo restante</p>
                  <p className={`text-2xl font-bold font-mono ${timeRemaining < 300 ? "text-red-500" : ""}`}>
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSubmitExam}
                disabled={submitExamMutation.isPending}
                variant="default"
              >
                {submitExamMutation.isPending ? "Enviando..." : "Finalizar Examen"}
              </Button>
            </div>
          </Card>
          
          {/* Questions */}
          {getExamQuery.isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Cargando preguntas...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q) => (
                <Card key={q.id} className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Pregunta {q.questionNumber}</Badge>
                        <Badge variant="secondary">{q.points} pts</Badge>
                        <Badge variant="outline" className="text-xs">{q.topic}</Badge>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <MathRenderer content={q.question} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Answer input based on type */}
                  {q.type === "multiple_choice" && q.options && (
                    <RadioGroup
                      value={answers[q.id] || ""}
                      onValueChange={(value) => handleAnswerChange(q.id, value)}
                    >
                      {q.options.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.charAt(0)} id={`q${q.id}-${idx}`} />
                          <Label htmlFor={`q${q.id}-${idx}`} className="cursor-pointer flex-1">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  
                  {q.type === "true_false" && (
                    <RadioGroup
                      value={answers[q.id] || ""}
                      onValueChange={(value) => handleAnswerChange(q.id, value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id={`q${q.id}-true`} />
                        <Label htmlFor={`q${q.id}-true`} className="cursor-pointer">
                          Verdadero
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id={`q${q.id}-false`} />
                        <Label htmlFor={`q${q.id}-false`} className="cursor-pointer">
                          Falso
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                  
                  {q.type === "open_ended" && (
                    <Textarea
                      placeholder="Escribe tu respuesta aquí..."
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      rows={6}
                    />
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Results screen
  if (examState === "completed" && result) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
            <h1 className="text-4xl font-bold">¡Examen Completado!</h1>
          </div>
          
          {/* Score card */}
          <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-card to-card/50">
            <p className="text-sm text-muted-foreground">Tu puntuación</p>
            <div className="space-y-2">
              <p className="text-6xl font-bold font-mono">{result.percentage}%</p>
              <p className="text-xl text-muted-foreground">
                {result.pointsEarned} / {result.totalPoints} puntos
              </p>
            </div>
          </Card>
          
          {/* Weak topics */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <h2 className="text-xl font-bold">Temas a practicar</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Ordenados por prioridad (de menor a mayor dominio)
            </p>
            <div className="space-y-3">
              {result.weakTopics.map((topic: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{idx + 1}</Badge>
                    <span className="font-medium">{topic.topic}</span>
                  </div>
                  <span className={`font-mono font-bold ${topic.score < 50 ? "text-red-500" : topic.score < 70 ? "text-yellow-500" : "text-green-500"}`}>
                    {topic.score}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Incorrect Answers with Correct Solutions */}
          {result.incorrectAnswers && result.incorrectAnswers.length > 0 && (
            <Card className="p-6 space-y-4 border-red-500/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold">Respuestas Incorrectas</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Revisa qué deberías haber respondido para mejorar
              </p>
              <div className="space-y-4">
                {result.incorrectAnswers.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 bg-muted/30 rounded-lg space-y-2">
                    <p className="font-semibold">Pregunta {item.questionNumber}: {item.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-red-500 font-medium">Tu respuesta:</span>
                        <p className="text-muted-foreground">{item.studentAnswer || "(Sin respuesta)"}</p>
                      </div>
                      <div>
                        <span className="text-green-500 font-medium">Respuesta correcta:</span>
                        <p className="font-medium">{item.correctAnswer}</p>
                      </div>
                    </div>
                    {item.explanation && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <span className="text-sm font-medium">Explicación:</span>
                        <p className="text-sm text-muted-foreground mt-1">{item.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Recomendaciones Personalizadas</h2>
            <div className="prose prose-sm max-w-none">
              <MathRenderer content={result.recommendations} />
            </div>
            <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg space-y-3">
              <p className="font-semibold text-cyan-400">Para mejorar tus resultados:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Practica los temas débiles con <strong>GeneraTusEjercicios (GTE)</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Consulta tus dudas con <strong>TizaIA</strong> disponible 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Reserva una <strong>clase presencial con ElProfeTino</strong> para atención personalizada</span>
                </li>
              </ul>
            </div>
          </Card>
          
          {/* Actions */}
          <div className="space-y-4">
            {/* Primary action: Book a class */}
            <a href={`https://wa.me/59898175225?text=${encodeURIComponent(`Hola ElProfeTino, quiero reservar una clase presencial. Necesito ayuda con: ${result.weakTopics.map((t: any) => t.topic).join(", ")}`)}`} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full text-lg py-6 glow-green" style={{ backgroundColor: "#00ff88", color: "#0a1628" }}>
                📞 Reservar Clase Presencial con ElProfeTino
              </Button>
            </a>
            
            {/* Secondary actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleDownloadTXT}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Reporte

  <div id="tep-result-report" className="mt-6 p-6 bg-card border border-border rounded-xl">
    <PDFDownloader 
      elementId="tep-result-report" 
      fileName={`Examen_TEP_${new Date().toISOString().slice(0,10)}.pdf`}
      buttonText="📄 Descargar Examen Corregido en PDF" 
    />
  </div> (TXT)
              </Button>
              <Button
                onClick={() => {
                  setExamState("config");
                  setExamId(null);
                  setTopics([]);
                  setAnswers({});
                  setResult(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Hacer Otro Examen
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="flex-1">
                  Ir al Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}


