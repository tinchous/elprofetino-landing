import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Users, Calendar, FileText, TrendingUp, Sparkles, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("students");

  // Set page title
  useEffect(() => {
    document.title = "Panel de Administración | ElProfeTino";
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast.error("Acceso denegado. Solo administradores.");
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, user, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6" style={{ color: '#00d4ff' }} />
                Panel de Administración
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gestión completa de estudiantes, clases y progreso
              </p>
            </div>
            <Button variant="outline" onClick={() => setLocation("/")}>
              Volver al Inicio
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Estudiantes</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Clases</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Ejercicios</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progreso</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <StudentsTab />
          </TabsContent>

          <TabsContent value="classes">
            <ClassesTab />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsTab />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Students Tab Component
function StudentsTab() {
  const { data: students, isLoading, refetch } = trpc.admin.listStudents.useQuery();
  const { data: users } = trpc.admin.listUsers.useQuery();
  const createStudent = trpc.admin.createStudent.useMutation();
  const updateStudent = trpc.admin.updateStudent.useMutation();
  const deleteStudent = trpc.admin.deleteStudent.useMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    userId: 0,
    level: "",
    institution: "",
    subjects: "",
    phone: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStudent.mutateAsync(formData);
      toast.success("Estudiante creado exitosamente");
      setIsCreateDialogOpen(false);
      refetch();
      setFormData({ userId: 0, level: "", institution: "", subjects: "", phone: "" });
    } catch (error: any) {
      toast.error(error.message || "Error al crear estudiante");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    try {
      await updateStudent.mutateAsync({
        id: editingStudent.id,
        level: formData.level,
        institution: formData.institution,
        subjects: formData.subjects,
        phone: formData.phone,
      });
      toast.success("Estudiante actualizado exitosamente");
      setEditingStudent(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar estudiante");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este estudiante? Se eliminarán todos sus datos relacionados.")) return;
    
    try {
      await deleteStudent.mutateAsync({ id });
      toast.success("Estudiante eliminado exitosamente");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar estudiante");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Estudiantes</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glow-cyan" style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Estudiante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Estudiante</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo estudiante
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">Usuario</Label>
                <Select value={formData.userId.toString()} onValueChange={(value) => setFormData({ ...formData, userId: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name || user.email || `Usuario #${user.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Nivel</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7-9">7º a 9º</SelectItem>
                      <SelectItem value="bachillerato">Bachillerato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institución</Label>
                  <Select value={formData.institution} onValueChange={(value) => setFormData({ ...formData, institution: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona institución" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Liceo">Liceo</SelectItem>
                      <SelectItem value="UTU">UTU</SelectItem>
                      <SelectItem value="Liceo Militar">Liceo Militar</SelectItem>
                      <SelectItem value="Magisterio">Magisterio</SelectItem>
                      <SelectItem value="Escuela Policía">Escuela Policía</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects">Materias (JSON)</Label>
                <Input
                  id="subjects"
                  placeholder='["matematica", "fisica"]'
                  value={formData.subjects}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createStudent.isPending}>
                  {createStudent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {students?.map((student) => (
          <Card key={student.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{student.userName || "Sin nombre"}</h3>
                <p className="text-sm text-muted-foreground">{student.userEmail}</p>
                <div className="flex gap-4 text-sm">
                  <span><strong>Nivel:</strong> {student.level || "N/A"}</span>
                  <span><strong>Teléfono:</strong> {student.phone || "N/A"}</span>
                </div>
                <p className="text-sm"><strong>Materias:</strong> {student.subjects || "N/A"}</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={editingStudent?.id === student.id} onOpenChange={(open) => {
                  if (open) {
                    setEditingStudent(student);
                    setFormData({
                      userId: student.userId,
                      level: student.level || "",
                      institution: student.institution || "",
                      subjects: student.subjects || "",
                      phone: student.phone || "",
                    });
                  } else {
                    setEditingStudent(null);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Estudiante</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-level">Nivel</Label>
                        <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7-9">7º a 9º</SelectItem>
                            <SelectItem value="bachillerato">Bachillerato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-subjects">Materias (JSON)</Label>
                        <Input
                          id="edit-subjects"
                          value={formData.subjects}
                          onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-phone">Teléfono</Label>
                        <Input
                          id="edit-phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={updateStudent.isPending}>
                          {updateStudent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(student.id)}
                  disabled={deleteStudent.isPending}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Classes Tab Component
function ClassesTab() {
  const { data: students } = trpc.admin.listStudents.useQuery();
  const { data: classes, isLoading, refetch } = trpc.admin.listClasses.useQuery({});
  const createClass = trpc.admin.createClass.useMutation();
  const updateClass = trpc.admin.updateClass.useMutation();
  const deleteClass = trpc.admin.deleteClass.useMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    studentId: 0,
    subject: "",
    scheduledAt: "",
    duration: 60,
    topic: "",
    notes: "",
    status: "scheduled",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClass.mutateAsync(formData);
      toast.success("Clase creada exitosamente");
      setIsCreateDialogOpen(false);
      refetch();
      setFormData({ studentId: 0, subject: "", scheduledAt: "", duration: 60, topic: "", notes: "" });
    } catch (error: any) {
      toast.error(error.message || "Error al crear clase");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    
    try {
      await updateClass.mutateAsync({
        id: editingClass.id,
        scheduledAt: formData.scheduledAt || undefined,
        duration: formData.duration,
        status: formData.status as any,
        topic: formData.topic,
        notes: formData.notes,
      });
      toast.success("Clase actualizada exitosamente");
      setEditingClass(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar clase");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta clase?")) return;
    
    try {
      await deleteClass.mutateAsync({ id });
      toast.success("Clase eliminada exitosamente");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar clase");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Clases</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glow-cyan" style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Clase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programar Nueva Clase</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Estudiante</Label>
                <Select value={formData.studentId.toString()} onValueChange={(value) => setFormData({ ...formData, studentId: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.userName || s.userEmail}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Materia</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona materia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Fecha y Hora</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Tema</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createClass.isPending}>
                  {createClass.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {classes?.map((cls) => (
          <Card key={cls.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{cls.topic || "Clase sin tema"}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    cls.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                    cls.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {cls.status === 'scheduled' ? 'Programada' : cls.status === 'completed' ? 'Completada' : 'Cancelada'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{(cls as any).studentName || 'Estudiante'}</p>
                <div className="flex gap-4 text-sm">
                  <span><strong>Materia:</strong> {cls.subject === 'matematica' ? 'Matemática' : 'Física'}</span>
                  <span><strong>Fecha:</strong> {new Date(cls.scheduledAt).toLocaleString('es-UY')}</span>
                  <span><strong>Duración:</strong> {cls.duration} min</span>
                </div>
                {cls.notes && <p className="text-sm"><strong>Notas:</strong> {cls.notes}</p>}
              </div>
              <div className="flex gap-2">
                <Dialog open={editingClass?.id === cls.id} onOpenChange={(open) => {
                  if (open) {
                    setEditingClass(cls);
                    setFormData({
                      studentId: cls.studentId,
                      subject: cls.subject,
                      scheduledAt: new Date(cls.scheduledAt).toISOString().slice(0, 16),
                      duration: cls.duration,
                      topic: cls.topic || "",
                      notes: cls.notes || "",
                      status: cls.status,
                    } as any);
                  } else {
                    setEditingClass(null);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Clase</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-scheduledAt">Fecha y Hora</Label>
                        <Input
                          id="edit-scheduledAt"
                          type="datetime-local"
                          value={formData.scheduledAt}
                          onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-status">Estado</Label>
                        <Select value={(formData as any).status} onValueChange={(value) => setFormData({ ...formData, status: value } as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Programada</SelectItem>
                            <SelectItem value="completed">Completada</SelectItem>
                            <SelectItem value="cancelled">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-topic">Tema</Label>
                        <Input
                          id="edit-topic"
                          value={formData.topic}
                          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-notes">Notas</Label>
                        <Textarea
                          id="edit-notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={updateClass.isPending}>
                          {updateClass.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(cls.id)}
                  disabled={deleteClass.isPending}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Assignments Tab Component
function AssignmentsTab() {
  const { data: students } = trpc.admin.listStudents.useQuery();
  const createAssignment = trpc.admin.createAssignment.useMutation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: 0,
    subject: "",
    topic: "",
    description: "",
    dueDate: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAssignment.mutateAsync(formData);
      toast.success("Ejercicio asignado exitosamente");
      setIsCreateDialogOpen(false);
      setFormData({ studentId: 0, subject: "", topic: "", description: "", dueDate: "" });
    } catch (error: any) {
      toast.error(error.message || "Error al asignar ejercicio");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Asignar Ejercicios</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glow-green" style={{ backgroundColor: '#00ff88', color: '#0a1628' }}>
              <Plus className="w-4 h-4 mr-2" />
              Asignar Ejercicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar Nuevo Ejercicio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Estudiante</Label>
                <Select value={formData.studentId.toString()} onValueChange={(value) => setFormData({ ...formData, studentId: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.userName || s.userEmail}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Materia</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona materia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Tema</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de Entrega</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createAssignment.isPending}>
                  {createAssignment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Asignar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="p-6 text-center text-muted-foreground">
        <p>Usa el botón "Asignar Ejercicio" para crear nuevas asignaciones.</p>
        <p className="text-sm mt-2">Los ejercicios aparecerán en el dashboard del estudiante.</p>
      </Card>
    </div>
  );
}

// Progress Tab Component
function ProgressTab() {
  const { data: students } = trpc.admin.listStudents.useQuery();
  const updateProgress = trpc.admin.updateProgress.useMutation();
  const updateToolAccess = trpc.admin.updateToolAccess.useMutation();

  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);
  const [progressFormData, setProgressFormData] = useState({
    subject: "",
    topic: "",
    level: 0,
  });
  const [toolAccessFormData, setToolAccessFormData] = useState({
    toolName: "",
    accessCount: 0,
  });

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error("Selecciona un estudiante");
      return;
    }

    try {
      await updateProgress.mutateAsync({
        studentId: selectedStudentId,
        ...progressFormData,
      });
      toast.success("Progreso actualizado exitosamente");
      setProgressFormData({ subject: "", topic: "", level: 0 });
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar progreso");
    }
  };

  const handleUpdateToolAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error("Selecciona un estudiante");
      return;
    }

    try {
      await updateToolAccess.mutateAsync({
        studentId: selectedStudentId,
        ...toolAccessFormData,
      });
      toast.success("Acceso a herramienta actualizado exitosamente");
      setToolAccessFormData({ toolName: "", accessCount: 0 });
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar acceso");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Progreso y Acceso</h2>

      {/* Student Selector */}
      <Card className="p-6">
        <div className="space-y-2">
          <Label htmlFor="student-select">Seleccionar Estudiante</Label>
          <Select value={selectedStudentId.toString()} onValueChange={(value) => setSelectedStudentId(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un estudiante" />
            </SelectTrigger>
            <SelectContent>
              {students?.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.userName || s.userEmail}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Update Progress */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: '#ffd700' }} />
            Actualizar Progreso
          </h3>
          <form onSubmit={handleUpdateProgress} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="progress-subject">Materia</Label>
              <Select value={progressFormData.subject} onValueChange={(value) => setProgressFormData({ ...progressFormData, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matematica">Matemática</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress-topic">Tema</Label>
              <Input
                id="progress-topic"
                value={progressFormData.topic}
                onChange={(e) => setProgressFormData({ ...progressFormData, topic: e.target.value })}
                placeholder="Ej: Álgebra, Derivadas, Vectores"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress-level">Nivel de Dominio (0-100)</Label>
              <Input
                id="progress-level"
                type="number"
                min="0"
                max="100"
                value={progressFormData.level}
                onChange={(e) => setProgressFormData({ ...progressFormData, level: parseInt(e.target.value) })}
                required
              />
              <div className="w-full bg-border rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${progressFormData.level}%`,
                    backgroundColor: progressFormData.level >= 70 ? '#00ff88' : progressFormData.level >= 40 ? '#ffd700' : '#ff6b35'
                  }}
                />
              </div>
            </div>
            <Button type="submit" disabled={updateProgress.isPending || !selectedStudentId} className="w-full">
              {updateProgress.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar Progreso"}
            </Button>
          </form>
        </Card>

        {/* Update Tool Access */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: '#00d4ff' }} />
            Acceso a Herramientas PEO
          </h3>
          <form onSubmit={handleUpdateToolAccess} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tool-name">Herramienta</Label>
              <Select value={toolAccessFormData.toolName} onValueChange={(value) => setToolAccessFormData({ ...toolAccessFormData, toolName: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona herramienta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tizaia">TizaIA</SelectItem>
                  <SelectItem value="generatusejercicios">GeneraTusEjercicios</SelectItem>
                  <SelectItem value="tuexamenpersonal">TuExamenPersonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-count">Número de Accesos</Label>
              <Input
                id="access-count"
                type="number"
                min="0"
                value={toolAccessFormData.accessCount}
                onChange={(e) => setToolAccessFormData({ ...toolAccessFormData, accessCount: parseInt(e.target.value) })}
                required
              />
            </div>
            <Button type="submit" disabled={updateToolAccess.isPending || !selectedStudentId} className="w-full">
              {updateToolAccess.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar Acceso"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
