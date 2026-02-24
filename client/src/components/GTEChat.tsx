import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Download, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { FileUploadWithCamera, Attachment } from "./FileUploadWithCamera";
import { MathRenderer } from "@/components/MathRenderer";

export function GTEChat() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("secundaria");
  const [quantity, setQuantity] = useState(3);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [exercises, setExercises] = useState("");

  const generateMutation = trpc.gte.generateExercises.useMutation({
    onSuccess: (data) => {
      setExercises(typeof data.exercises === 'string' ? data.exercises : '');
      toast.success("Ejercicios generados exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al generar ejercicios");
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Por favor ingresa un tema");
      return;
    }

    generateMutation.mutate({
      topic,
      level,
      quantity,
      attachments,
    });
  };

  // Separar ejercicios y soluciones
  const getExercisesOnly = () => {
    if (!exercises) return "";
    const parts = exercises.split(/---\s*#\s*SOLUCIONES/i);
    return parts[0].trim();
  };

  const getSolutionsOnly = () => {
    if (!exercises) return "";
    const parts = exercises.split(/---\s*#\s*SOLUCIONES/i);
    return parts.length > 1 ? `# SOLUCIONES\n\n${parts[1].trim()}` : "";
  };

  const downloadTXT = (includeSolutions: boolean) => {
    if (!exercises) return;
    
    const content = includeSolutions ? exercises : getExercisesOnly();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const suffix = includeSolutions ? "completo" : "solo-preguntas";
    a.download = `ejercicios-${topic.replace(/\s+/g, "-")}-${suffix}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(includeSolutions ? "Descargado con soluciones" : "Descargado solo preguntas");
  };

  const downloadPDF = () => {
    toast.info("Función de descarga en PDF próximamente");
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card className="p-6 space-y-4 bg-card/50 backdrop-blur-sm border-cyan-500/20">
        <div className="space-y-2">
          <Label htmlFor="topic">Tema del ejercicio</Label>
          <Input
            id="topic"
            placeholder="Ej: Ecuaciones de segundo grado, Cinemática, Trigonometría..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="level">Nivel</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="level" className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secundaria">Secundaria</SelectItem>
                <SelectItem value="bachillerato">Bachillerato</SelectItem>
                <SelectItem value="universitario">Universitario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="bg-background/50"
            />
          </div>
        </div>

        <FileUploadWithCamera
          onFilesSelected={setAttachments}
          maxFiles={5}
        />

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="w-full"
          style={{ backgroundColor: "#00ff88", color: "#0a1628" }}
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            "Generar Ejercicios"
          )}
        </Button>
      </Card>

      {/* Results */}
      {exercises && (
        <Card className="p-6 space-y-4 bg-card/50 backdrop-blur-sm border-green-500/20">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-xl font-bold">Ejercicios Generados</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTXT(false)}
              >
                <Download className="w-4 h-4 mr-2" />
                Solo Preguntas (TXT)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTXT(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Preguntas + Soluciones (TXT)
              </Button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <MathRenderer content={exercises} />
          </div>
        </Card>
      )}
    </div>
  );
}
