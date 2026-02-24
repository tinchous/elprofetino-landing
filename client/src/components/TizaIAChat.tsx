import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Send, Paperclip, Download, FileText, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { MathRenderer } from "@/components/MathRenderer";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachments?: Array<{
    type: "text" | "image";
    filename?: string;
    preview?: string;
  }>;
}

interface Attachment {
  type: "text" | "image";
  content: string;
  filename?: string;
  preview?: string;
}

export default function TizaIAChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = trpc.tizaia.sendMessage.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`El archivo ${file.name} es demasiado grande (máx. 10MB)`);
        continue;
      }

      if (file.type.startsWith("image/")) {
        // Handle image
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          newAttachments.push({
            type: "image",
            content: dataUrl,
            filename: file.name,
            preview: dataUrl,
          });
          if (newAttachments.length === files.length) {
            setAttachments([...attachments, ...newAttachments]);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
        // Handle text file
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          newAttachments.push({
            type: "text",
            content: text,
            filename: file.name,
            preview: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
          });
          if (newAttachments.length === files.length) {
            setAttachments([...attachments, ...newAttachments]);
          }
        };
        reader.readAsText(file);
      } else {
        toast.error(`Tipo de archivo no soportado: ${file.name}`);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      attachments: attachments.map(a => ({ type: a.type, filename: a.filename, preview: a.preview })),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage.mutateAsync({
        message: input,
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content })) as any,
        attachments: attachments.map(a => ({ type: a.type, content: a.content, filename: a.filename })),
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: typeof response.message === 'string' ? response.message : JSON.stringify(response.message),
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setAttachments([]);
    } catch (error: any) {
      toast.error(error.message || "Error al enviar mensaje");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTXT = () => {
    const content = messages.map(m => {
      const time = new Date(m.timestamp).toLocaleString();
      const role = m.role === "user" ? "Tú" : "TizaIA";
      return `[${time}] ${role}:\n${m.content}\n`;
    }).join("\n---\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tizaia-conversacion-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Conversación descargada en TXT");
  };

  const downloadPDF = () => {
    toast.info("Funcionalidad de PDF próximamente. Por ahora descarga en TXT.");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/QBin1Xve69oQzURzJmzsJd/sandbox/Fa4SeB7ofBXnlfopmEgvMz_1771392552783_na1fn_dGl6YWlhLXJvYm90.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUJpbjFYdmU2OW9RelVSekptenNKZC9zYW5kYm94L0ZhNFNlQjdvZkJYbmxmb3BtRWd2TXpfMTc3MTM5MjU1Mjc4M19uYTFmbl9kR2w2WVdsaExYSnZZbTkwLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LG2g9c4YqNoj5ZThts7wo3nTkHeLSA6ZPAa6QtiUbF7NNVMrsuXqXjD~973Geyoac5AIeZPvvrC2L-nCOue6aAx0xqbLYEid~PfZ3s5XiLhu4JVAgcQw30ZOor6wy-ijfJXyeONxBMFCrH3DJYzISArUxRocmtd4F~8U4ej3rziI9cSWm3DcALpfKIKyGtHZv4HfPOFBC3PjNdrKtJVdeCYaxhZ6lowWIvjlmC-hbZHS5E1HwqK2irIA6RxRmiSLWDq5LN9ginSbW8dHYOpNLfVr7OC-6QbHfgKSSNm8wmF-nC7GSEXTOt5VZnMaYtQU7azJWMDHt4ESlLxYx-sNcQ__"
                alt="TizaIA"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#00d4ff" }}>TizaIA</h2>
              <p className="text-sm text-muted-foreground">Tu Asistente Educativo</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadTXT} disabled={messages.length === 0}>
              <FileText className="w-4 h-4 mr-2" />
              TXT
            </Button>
            <Button variant="outline" size="sm" onClick={downloadPDF} disabled={messages.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/QBin1Xve69oQzURzJmzsJd/sandbox/Fa4SeB7ofBXnlfopmEgvMz_1771392552783_na1fn_dGl6YWlhLXJvYm90.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUJpbjFYdmU2OW9RelVSekptenNKZC9zYW5kYm94L0ZhNFNlQjdvZkJYbmxmb3BtRWd2TXpfMTc3MTM5MjU1Mjc4M19uYTFmbl9kR2w2WVdsaExYSnZZbTkwLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LG2g9c4YqNoj5ZThts7wo3nTkHeLSA6ZPAa6QtiUbF7NNVMrsuXqXjD~973Geyoac5AIeZPvvrC2L-nCOue6aAx0xqbLYEid~PfZ3s5XiLhu4JVAgcQw30ZOor6wy-ijfJXyeONxBMFCrH3DJYzISArUxRocmtd4F~8U4ej3rziI9cSWm3DcALpfKIKyGtHZv4HfPOFBC3PjNdrKtJVdeCYaxhZ6lowWIvjlmC-hbZHS5E1HwqK2irIA6RxRmiSLWDq5LN9ginSbW8dHYOpNLfVr7OC-6QbHfgKSSNm8wmF-nC7GSEXTOt5VZnMaYtQU7azJWMDHt4ESlLxYx-sNcQ__"
                alt="TizaIA"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#00d4ff" }}>¡Hola! Soy TizaIA</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Estoy aquí para ayudarte a entender matemática y física. Puedes preguntarme sobre conceptos, fórmulas, procedimientos, o subir una imagen de un ejercicio para que te explique cómo abordarlo.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              💡 Recuerda: Te explico cómo resolver, pero no te doy la respuesta final. ¡Así aprendes mejor!
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-cyan-500/20 border border-cyan-500/30"
                  : "bg-card border border-border"
              }`}
            >
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-2 space-y-2">
                  {message.attachments.map((att, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      {att.type === "image" ? (
                        <>
                          <ImageIcon className="w-4 h-4" />
                          <span>{att.filename}</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          <span>{att.filename}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {message.role === "assistant" ? (
                <MathRenderer content={message.content} />
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#00d4ff" }} />
                <span className="text-sm text-muted-foreground">TizaIA está pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="border-t border-border p-2 bg-card/50">
          <div className="flex flex-wrap gap-2">
            {attachments.map((att, index) => (
              <div key={index} className="relative group">
                <div className="flex items-center gap-2 bg-background border border-border rounded px-3 py-2">
                  {att.type === "image" ? (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm">{att.filename}</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span className="text-sm max-w-[200px] truncate">{att.filename}</span>
                    </>
                  )}
                  <button
                    onClick={() => removeAttachment(index)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card rounded-b-lg">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,text/*,.txt"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Escribe tu pregunta o sube un archivo..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            style={{ backgroundColor: "#00d4ff", color: "#0a1628" }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Puedes subir imágenes de ejercicios o archivos de texto. TizaIA te explicará los conceptos sin darte la respuesta final.
        </p>
      </div>
    </div>
  );
}
