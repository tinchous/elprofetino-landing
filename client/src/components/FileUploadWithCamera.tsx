import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

export interface Attachment {
  type: "image" | "text";
  content: string; // base64 for images, text content for text files
  filename?: string;
  preview?: string; // URL for preview
}

interface FileUploadWithCameraProps {
  onFilesSelected: (attachments: Attachment[]) => void;
  maxFiles?: number;
}

export function FileUploadWithCamera({ onFilesSelected, maxFiles = 5 }: FileUploadWithCameraProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (attachments.length + files.length > maxFiles) {
      toast.error(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    const newAttachments: Attachment[] = [];

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          newAttachments.push({
            type: "image",
            content: base64,
            filename: file.name,
            preview: base64,
          });

          if (newAttachments.length === files.length) {
            const updated = [...attachments, ...newAttachments];
            setAttachments(updated);
            onFilesSelected(updated);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          newAttachments.push({
            type: "text",
            content: text,
            filename: file.name,
          });

          if (newAttachments.length === files.length) {
            const updated = [...attachments, ...newAttachments];
            setAttachments(updated);
            onFilesSelected(updated);
          }
        };
        reader.readAsText(file);
      } else {
        toast.error(`Tipo de archivo no soportado: ${file.name}`);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      toast.error("No se pudo acceder a la cámara");
      console.error(error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL("image/jpeg");
      
      const newAttachment: Attachment = {
        type: "image",
        content: base64,
        filename: `foto-${Date.now()}.jpg`,
        preview: base64,
      };

      const updated = [...attachments, newAttachment];
      setAttachments(updated);
      onFilesSelected(updated);
      stopCamera();
      toast.success("Foto capturada");
    }
  };

  const removeAttachment = (index: number) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
    onFilesSelected(updated);
  };

  return (
    <div className="space-y-4">
      {/* Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-4 h-4 mr-2" />
          Adjuntar archivo
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={startCamera}
        >
          <Camera className="w-4 h-4 mr-2" />
          Tomar foto
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,text/plain"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Camera view */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="max-w-full max-h-[70vh] rounded-lg"
          />
          <div className="flex gap-4 mt-4">
            <Button onClick={capturePhoto} size="lg">
              Capturar
            </Button>
            <Button onClick={stopCamera} variant="outline" size="lg">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="relative group"
            >
              {attachment.type === "image" && attachment.preview ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img
                    src={attachment.preview}
                    alt={attachment.filename}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="relative w-20 h-20 rounded-lg border border-border bg-muted flex items-center justify-center p-2">
                  <p className="text-xs text-center truncate">{attachment.filename}</p>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
