import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { User, Save, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";

export default function Profile() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  const { data: student, isLoading: studentLoading } = trpc.dashboard.getStudent.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateProfile = trpc.admin.updateStudent.useMutation({
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [formData, setFormData] = useState({
    phone: "",
    level: "",
    subjects: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        phone: student.phone || "",
        level: student.level || "",
        subjects: student.subjects || "",
      });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    updateProfile.mutate({
      id: student.id,
      phone: formData.phone,
      level: formData.level,
      subjects: formData.subjects,
    });
  };

  useEffect(() => {
    document.title = "Mi Perfil | ElProfeTino";
  }, []);

  if (authLoading || studentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-muted-foreground">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-display font-bold">Acceso Restringido</h2>
          <p className="text-muted-foreground">
            Necesitas iniciar sesión para acceder a tu perfil.
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 flex items-center justify-center">
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
            <Link href="/">
              <Button variant="outline" className="w-full">
                Volver al Inicio
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-20">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold">Mi Perfil</h1>
            <p className="text-lg text-muted-foreground">
              Actualiza tu información personal
            </p>
          </div>

          {/* Profile Card */}
          <Card className="p-8 border-glow-cyan bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
                <User className="w-10 h-10" style={{ color: '#00d4ff' }} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+598 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background/50"
                />
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">Nivel Educativo</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7mo">7º año</SelectItem>
                    <SelectItem value="8vo">8º año</SelectItem>
                    <SelectItem value="9no">9º año</SelectItem>
                    <SelectItem value="1ro_bach">1º Bachillerato</SelectItem>
                    <SelectItem value="2do_bach">2º Bachillerato</SelectItem>
                    <SelectItem value="3ro_bach">3º Bachillerato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subjects */}
              <div className="space-y-2">
                <Label htmlFor="subjects">Materias de Interés</Label>
                <Select value={formData.subjects} onValueChange={(value) => setFormData({ ...formData, subjects: value })}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Selecciona las materias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="ambas">Ambas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full glow-cyan font-semibold gap-2"
                style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Account Info */}
          <Card className="p-6 bg-card/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Información de la Cuenta</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método de inicio de sesión:</span>
                <span className="font-medium capitalize">{user?.loginMethod || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rol:</span>
                <span className="font-medium capitalize">{user?.role || 'user'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Miembro desde:</span>
                <span className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-UY') : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
