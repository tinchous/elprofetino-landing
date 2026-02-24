/**
 * Design Philosophy: Cosmic Education - Futurismo Educativo Espacial
 * - Fondo oscuro navy con efectos glow cyan/dorado
 * - Interacciones fluidas con animaciones suaves
 * - Tipografía moderna (Space Grotesk + Inter)
 */

import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
  keywords: string[];
}

const faqs: FAQ[] = [
  {
    question: "¿Qué materias enseñás?",
    answer: "Enseño Matemática y Física para todos los niveles: secundaria, bachillerato, UTU y preparación para exámenes. Mi especialidad es llevar la teoría a la práctica para que realmente entiendas los conceptos.",
    keywords: ["materias", "enseñas", "asignaturas", "matemática", "física", "niveles"]
  },
  {
    question: "¿Cuánto cuestan las clases?",
    answer: "Tengo diferentes cuponeras 2026: APOYO (8 clases - UYU 3.800), NO ENTIENDO (12 clases - UYU 5.400), PREPARA TU EXAMEN (12 clases - UYU 4.800, solo febrero 2026) y EN EL HORNO (15 clases - UYU 6.375). Todas incluyen acceso a las herramientas PEO (TizaIA, GeneraTusEjercicios, TuExamenPersonal).",
    keywords: ["precio", "costo", "cuanto", "pagar", "tarifa", "cuponera"]
  },
  {
    question: "¿Dónde das las clases?",
    answer: "Las clases son presenciales en la zona del Cordón, Montevideo. También puedo hacer clases online si lo preferís. La dirección exacta te la paso cuando coordinemos la primera clase.",
    keywords: ["donde", "ubicación", "lugar", "dirección", "presencial", "online", "cordón"]
  },
  {
    question: "¿Qué son las herramientas PEO?",
    answer: "PEO son tres herramientas con IA educativa que te ayudan a estudiar: TizaIA (asistente virtual que responde tus dudas 24/7), GeneraTusEjercicios (crea ejercicios personalizados según tu nivel) y TuExamenPersonal (genera exámenes de práctica). Todas incluidas en las cuponeras.",
    keywords: ["peo", "herramientas", "tizaia", "ia", "inteligencia artificial", "ejercicios", "examen"]
  },
  {
    question: "¿Cuánta experiencia tenés?",
    answer: "Tengo más de 20 años de experiencia dando clases particulares de Matemática y Física. Mi método se basa en entender primero, practicar después. En febrero 2026 todos mis alumnos aprobaron (11 de 11) - ¡éxito total!",
    keywords: ["experiencia", "años", "trayectoria", "resultados", "aprobados"]
  },
  {
    question: "¿Cómo funciona la metodología?",
    answer: "Mi método es simple: llevar la teoría a la realidad para que comprendas, ganes confianza y rindas mejor. Clases uno a uno, personalizadas según tu nivel y necesidades. Uso ejemplos prácticos y las herramientas PEO para reforzar el aprendizaje.",
    keywords: ["metodología", "método", "como", "funciona", "clases", "enseñanza"]
  },
  {
    question: "¿Cómo puedo contactarte?",
    answer: "Podés contactarme por WhatsApp al +598 92 345 678 (hacé clic en el botón verde flotante) o completá el formulario de contacto al final de la página. Te respondo rápido para coordinar tu primera clase.",
    keywords: ["contacto", "whatsapp", "teléfono", "comunicar", "hablar", "escribir"]
  },
  {
    question: "¿Das clases grupales?",
    answer: "Me especializo en clases particulares uno a uno porque así puedo personalizar totalmente el contenido según tus necesidades y ritmo de aprendizaje. Esto garantiza mejores resultados.",
    keywords: ["grupales", "grupo", "individuales", "particulares", "uno a uno"]
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensaje de bienvenida
      addBotMessage(
        "¡Hola! Soy el asistente virtual de ElProfeTino 🚀\n\n¿En qué puedo ayudarte? Podés preguntarme sobre:\n• Materias y niveles\n• Precios y cuponeras\n• Ubicación y modalidad\n• Herramientas PEO\n• Metodología\n• Contacto"
      );
      setShowMenu(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const findAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Buscar coincidencias por keywords
    for (const faq of faqs) {
      const hasKeyword = faq.keywords.some(keyword => 
        lowerQuestion.includes(keyword.toLowerCase())
      );
      if (hasKeyword) {
        return faq.answer;
      }
    }

    // Respuesta por defecto
    return "No estoy seguro de cómo responder a eso. Te recomiendo contactar directamente por WhatsApp (+598 92 345 678) o completar el formulario de contacto. ¡ElProfeTino te responderá personalmente! 😊";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    addUserMessage(inputValue);
    setInputValue("");
    setShowMenu(false);
    
    // Simular "escribiendo..."
    setIsTyping(true);
    
    setTimeout(() => {
      const answer = findAnswer(inputValue);
      addBotMessage(answer);
      setIsTyping(false);
      
      // Mostrar opciones después de la respuesta
      setTimeout(() => {
        addBotMessage("¿Necesitás algo más?\n\n• Escribí otra pregunta\n• O hacé clic en 'Volver al Menú' para ver todas las opciones");
        setShowMenu(false);
      }, 500);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    addUserMessage(question);
    setShowMenu(false);
    setIsTyping(true);
    
    setTimeout(() => {
      const faq = faqs.find(f => f.question === question);
      if (faq) {
        addBotMessage(faq.answer);
      }
      setIsTyping(false);
      
      // Mostrar opciones después de la respuesta
      setTimeout(() => {
        addBotMessage("¿Necesitás algo más?\n\n• Escribí otra pregunta\n• O hacé clic en 'Volver al Menú' para ver todas las opciones");
        setShowMenu(false);
      }, 500);
    }, 1000);
  };

  const handleBackToMenu = () => {
    addBotMessage(
      "¡Perfecto! Acá están las opciones del menú principal:\n\n¿Sobre qué querés saber más?"
    );
    setShowMenu(true);
  };

  const handleCloseChat = () => {
    addBotMessage(
      "¡Gracias por tu consulta! Si tenés más dudas, podés volver cuando quieras. ¡Hasta pronto! 🚀"
    );
    setTimeout(() => {
      setIsOpen(false);
      // Resetear el chat después de cerrar
      setTimeout(() => {
        setMessages([]);
        setShowMenu(false);
      }, 300);
    }, 2000);
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 group"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            ¿Tenés dudas? ¡Preguntame!
          </div>
        </button>
      )}

      {/* Ventana del chatbot */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white">ElProfeTino Bot</h3>
                <p className="text-xs text-cyan-100">Asistente virtual</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                        : "bg-slate-800 text-slate-100 border border-slate-700"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preguntas rápidas y opciones */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            {showMenu ? (
              <>
                <p className="text-xs text-slate-400 mb-2">Preguntas frecuentes:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickQuestion("¿Qué materias enseñás?")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1 rounded-full transition-colors"
                  >
                    Materias
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("¿Cuánto cuestan las clases?")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1 rounded-full transition-colors"
                  >
                    Precios
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("¿Qué son las herramientas PEO?")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1 rounded-full transition-colors"
                  >
                    PEO
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("¿Dónde das las clases?")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1 rounded-full transition-colors"
                  >
                    Ubicación
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("¿Cómo funciona la metodología?")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1 rounded-full transition-colors"
                  >
                    Metodología
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("¿Cómo puedo contactarte?")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1 rounded-full transition-colors"
                  >
                    Contacto
                  </button>
                </div>
              </>
            ) : (
              messages.length > 2 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleBackToMenu}
                    className="text-sm bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
                  >
                    🏠 Volver al Menú
                  </button>
                  <button
                    onClick={handleCloseChat}
                    className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-full transition-all duration-300"
                  >
                    ✕ Cerrar Chat
                  </button>
                </div>
              )
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
