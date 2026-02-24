import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Calendar, Clock, BookOpen, CheckCircle } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [subject, setSubject] = useState<"matematica" | "fisica">("matematica");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(60);

  const utils = trpc.useUtils();

  // Get available slots for selected date
  const { data: slots, isLoading: slotsLoading } = trpc.dashboard.getAvailableSlots.useQuery(
    { date: selectedDate },
    { enabled: !!selectedDate }
  );

  const bookClass = trpc.dashboard.bookClass.useMutation({
    onSuccess: () => {
      toast.success("¡Clase reservada exitosamente!");
      utils.dashboard.getUpcomingClasses.invalidate();
      onOpenChange(false);
      // Reset form
      setSelectedDate("");
      setSelectedSlot("");
      setTopic("");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (!selectedSlot) {
      toast.error("Por favor selecciona un horario");
      return;
    }

    const slot = slots?.find(s => s.time === selectedSlot);
    if (!slot) {
      toast.error("Horario no válido");
      return;
    }

    bookClass.mutate({
      scheduledAt: slot.scheduledAt.toISOString(),
      subject,
      topic: topic || undefined,
      duration,
    });
  };

  // Generate next 14 days (excluding weekends)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  }).filter(date => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" style={{ color: '#00d4ff' }} />
            Reservar Clase
          </DialogTitle>
          <DialogDescription>
            Selecciona fecha, horario y materia para tu próxima clase
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Selecciona una fecha" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map(date => (
                  <SelectItem key={date.toISOString()} value={date.toISOString().split('T')[0]}>
                    {date.toLocaleDateString('es-UY', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div className="space-y-2">
              <Label htmlFor="slot">Horario</Label>
              {slotsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots?.map(slot => (
                    <Button
                      key={slot.time}
                      variant={selectedSlot === slot.time ? "default" : "outline"}
                      className={`${
                        !slot.available ? "opacity-50 cursor-not-allowed" : ""
                      } ${
                        selectedSlot === slot.time ? "glow-cyan" : ""
                      }`}
                      style={selectedSlot === slot.time ? { backgroundColor: '#00d4ff', color: '#0a1628' } : {}}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {slot.time}
                      {!slot.available && " (Ocupado)"}
                    </Button>
                  ))}
                </div>
              )}
              {slots && slots.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay horarios disponibles para esta fecha
                </p>
              )}
            </div>
          )}

          {/* Subject Selection */}
          <div className="space-y-2">
            <Label htmlFor="subject">Materia</Label>
            <Select value={subject} onValueChange={(value: "matematica" | "fisica") => setSubject(value)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matematica">Matemática</SelectItem>
                <SelectItem value="fisica">Física</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic">Tema (opcional)</Label>
            <Input
              id="topic"
              placeholder="Ej: Funciones trigonométricas, Cinemática..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duración</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1.5 horas</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          {selectedDate && selectedSlot && (
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-cyan-500/30">
              <h4 className="font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: '#00d4ff' }} />
                Resumen de la Reserva
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">Fecha:</span>{" "}
                  {new Date(selectedDate).toLocaleDateString('es-UY', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p>
                  <span className="text-muted-foreground">Hora:</span> {selectedSlot}
                </p>
                <p>
                  <span className="text-muted-foreground">Materia:</span>{" "}
                  {subject === "matematica" ? "Matemática" : "Física"}
                </p>
                {topic && (
                  <p>
                    <span className="text-muted-foreground">Tema:</span> {topic}
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">Duración:</span>{" "}
                  {duration === 60 ? "1 hora" : duration === 90 ? "1.5 horas" : "2 horas"}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={bookClass.isPending}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 glow-green font-semibold gap-2"
              style={{ backgroundColor: '#00ff88', color: '#0a1628' }}
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedSlot || bookClass.isPending}
            >
              {bookClass.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Reservando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirmar Reserva
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
