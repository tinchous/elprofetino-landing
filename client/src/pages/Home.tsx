import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";
import Chatbot from "@/components/Chatbot";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Star, CheckCircle, Sparkles, Brain, PenTool, FileText, MapPin, Phone, Globe, Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

/* Design: Cosmic Education - Futurismo Educativo Espacial
   Colors: Space Navy (#0a1628), Cyan (#00d4ff), Gold (#ffd700), Green (#00ff88)
   Typography: Space Grotesk (display), Inter (body), JetBrains Mono (numbers)
   Layout: Asymmetric, floating cards, diagonal sections, parallax effects
*/

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  // Set page title for SEO (30-60 characters)
  useEffect(() => {
    document.title = "Clases Particulares de Matemática y Física | ElProfeTino";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    level: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Mensaje enviado! Te contactaremos pronto.");
    setFormData({ name: "", email: "", phone: "", subject: "", level: "", message: "" });
  };

  const whatsappNumber = "59898175225";
  const whatsappMessage = encodeURIComponent("Hola, quiero información sobre las clases de ElProfeTino");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 glow-green"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/QBin1Xve69oQzURzJmzsJd/sandbox/Fa4SeB7ofBXnlfopmEgvMz-img-1_1771392552000_na1fn_aGVyby1iYW5uZXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUJpbjFYdmU2OW9RelVSekptenNKZC9zYW5kYm94L0ZhNFNlQjdvZkJYbmxmb3BtRWd2TXotaW1nLTFfMTc3MTM5MjU1MjAwMF9uYTFmbl9hR1Z5YnkxaVlXNXVaWEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=jnVEX76gHuOqA4rSLoZYKEjK7KTblVZnP9p3XY1fO~Q0QE5Iqf10L2HgZJ71Mnni5jogqps5mw6Be6ChImjAoc-r53LiwfOp3l-43UgSQZPdxLCQsXUIIwN0aQD0ymDLX~wtptzGodEBOfbrBzGrzFKWDPQjhbazJX8ogYFj466keGExRuaIrVtSW6OK7XQlqq73iPMEIIcUauupBD~~B2zHVio~o9VCQFFo~n3yLI03Rj194p0~G6cvlGpjdzxEKLKslSVnNfG32E0LQKx70oYSGZr5PhlI17~OuWZPPIibthWQ8kAvM-BR9dfnL1pZQP~4tkoFlbTBq6kYt6JM2g__')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo/Brand */}
            <div className="inline-block">
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-2">
                <span className="text-foreground">ElProfe</span>
                <span className="text-glow-cyan" style={{ color: '#00d4ff' }}>Tino</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-medium tracking-wide">
                Educación Inteligente • PEO
              </p>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              Aprender es <span className="text-glow-gold" style={{ color: '#ffd700' }}>Entender</span>
            </h2>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              <strong>Clases particulares de matemática y física</strong> presenciales en Montevideo, uno a uno, con un método simple: llevar la teoría a la realidad para que el alumno <strong>comprenda</strong>, gane confianza y rinda mejor.
            </p>

            {/* Success Badge */}
            <div className="inline-block border-glow-gold rounded-xl px-6 py-3 bg-card/50 backdrop-blur-sm">
              <p className="text-lg md:text-xl font-bold" style={{ color: '#ffd700' }}>
                ¡Aprobados en Febrero: Todos Menos 1! - ¡ÉXITO TOTAL!
              </p>
            </div>

            {/* Key Points */}
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                <CheckCircle className="w-5 h-5" style={{ color: '#00ff88' }} />
                <span>Experiencia ≥ 20 años</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                <CheckCircle className="w-5 h-5" style={{ color: '#00ff88' }} />
                <span>Matemática & Física</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                <MapPin className="w-5 h-5" style={{ color: '#00d4ff' }} />
                <span>Zona Cordón</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 glow-cyan font-semibold"
                    style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Mi Dashboard
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 glow-green animate-pulse-glow font-semibold"
                  style={{ backgroundColor: '#00ff88', color: '#0a1628' }}
                  asChild
                >
                  <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-glow-cyan font-semibold"
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Ver Herramientas PEO
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 relative">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="order-2 md:order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-2xl blur-2xl"></div>
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663365198114/PNcjTwvLkcpvtlRW.png"
                    alt="ElProfeTino - Profesor calvo con lentes"
                    className="relative rounded-2xl w-full max-w-md mx-auto animate-float"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-display font-bold">
                  <strong>Profesor particular de matemática y física</strong> con <span className="text-glow-cyan" style={{ color: '#00d4ff' }}>Toque Humano</span>
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Con más de <strong className="font-mono" style={{ color: '#ffd700' }}>20 años de experiencia</strong> como <strong>profesor particular en Montevideo</strong>, especializado en la enseñanza de <strong>Matemática y Física para secundaria y bachillerato</strong>, he desarrollado un método único que combina la tecnología educativa más avanzada con la <strong>atención personalizada</strong> que cada estudiante necesita.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Mi filosofía es simple: <strong>llevar la teoría a la realidad</strong>. Uso ejemplos de la vida cotidiana (fútbol, cocina, skate, mate... lo que sea) para que los conceptos abstractos cobren sentido y se queden contigo para siempre.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5" style={{ color: '#00d4ff' }} />
                      <span className="font-semibold">IA educativa</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Herramientas propias 24/7</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" style={{ color: '#00ff88' }} />
                      <span className="font-semibold">Profe real</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Clases presenciales 1 a 1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Herramientas PEO */}
      <section id="servicios" className="py-20 relative">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Herramientas <span className="text-glow-cyan" style={{ color: '#00d4ff' }}>PEO</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <strong>Plataforma Educativa Online</strong> con 3 herramientas de <strong>IA educativa</strong> creadas por mí para <strong>apoyo escolar</strong> continuo: no te quedes con dudas y practicá con criterio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* TizaIA */}
            <Card className="p-8 border-glow-cyan bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/QBin1Xve69oQzURzJmzsJd/sandbox/Fa4SeB7ofBXnlfopmEgvMz_1771392552783_na1fn_dGl6YWlhLXJvYm90.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUJpbjFYdmU2OW9RelVSekptenNKZC9zYW5kYm94L0ZhNFNlQjdvZkJYbmxmb3BtRWd2TXpfMTc3MTM5MjU1Mjc4M19uYTFmbl9kR2w2WVdsaExYSnZZbTkwLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LG2g9c4YqNoj5ZThts7wo3nTkHeLSA6ZPAa6QtiUbF7NNVMrsuXqXjD~973Geyoac5AIeZPvvrC2L-nCOue6aAx0xqbLYEid~PfZ3s5XiLhu4JVAgcQw30ZOor6wy-ijfJXyeONxBMFCrH3DJYzISArUxRocmtd4F~8U4ej3rziI9cSWm3DcALpfKIKyGtHZv4HfPOFBC3PjNdrKtJVdeCYaxhZ6lowWIvjlmC-hbZHS5E1HwqK2irIA6RxRmiSLWDq5LN9ginSbW8dHYOpNLfVr7OC-6QbHfgKSSNm8wmF-nC7GSEXTOt5VZnMaYtQU7azJWMDHt4ESlLxYx-sNcQ__"
                    alt="TizaIA Robot"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-display font-bold flex items-center justify-center gap-2">
                  <Brain className="w-6 h-6" style={{ color: '#00d4ff' }} />
                  TizaIA
                </h3>
                <p className="text-sm font-semibold" style={{ color: '#00d4ff' }}>Tu Asistente Educativo</p>
                <p className="text-foreground/80 leading-relaxed">
                  Responde dudas y explica temas, fórmulas y procedimientos con lenguaje claro y ejemplos reales. Disponible 24/7 para que nunca te quedes con dudas.
                </p>
              </div>
              <Link href="/tizaia">
                <Button className="w-full glow-cyan" style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}>
                  Conocer más
                </Button>
              </Link>
            </Card>

            {/* GeneraTusEjercicios */}
            <Card className="p-8 border-glow-green bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                  <PenTool className="w-12 h-12" style={{ color: '#00ff88' }} />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-display font-bold flex items-center justify-center gap-2">
                  <PenTool className="w-6 h-6" style={{ color: '#00ff88' }} />
                  GeneraTusEjercicios
                </h3>
                <p className="text-sm font-semibold" style={{ color: '#00ff88' }}>Práctica Ilimitada</p>
                <p className="text-foreground/80 leading-relaxed">
                  Genera práctica con ejercicios similares, adaptados a tu nivel. Más práctica = más seguridad. Entrena hasta dominar cada tema.
                </p>
              </div>
              <Link href="/generatusejercicios">
                <Button className="w-full glow-green" style={{ backgroundColor: '#00ff88', color: '#0a1628' }}>
                  Conocer más
                </Button>
              </Link>
            </Card>

            {/* TuExamenPersonal */}
            <Card className="p-8 border-glow-gold bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 flex items-center justify-center">
                  <FileText className="w-12 h-12" style={{ color: '#ffd700' }} />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-display font-bold flex items-center justify-center gap-2">
                  <FileText className="w-6 h-6" style={{ color: '#ffd700' }} />
                  TuExamenPersonal
                </h3>
                <p className="text-sm font-semibold" style={{ color: '#ffd700' }}>Simulá el Examen</p>
                <p className="text-foreground/80 leading-relaxed">
                  Simula un examen real: lo resolvés online, con tiempo y corrección automática. Llegás con cancha al examen y sin nervios.
                </p>
              </div>
              <Link href="/tuexamenpersonal">
                <Button className="w-full glow-gold" style={{ backgroundColor: '#ffd700', color: '#0a1628' }}>
                  Conocer más
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section - Cuponeras */}
      <section className="py-20 relative">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Cuponeras <span className="font-mono" style={{ color: '#ffd700' }}>2026</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elegí el <strong>paquete de clases particulares</strong> según tu situación. Todas las clases son <strong>presenciales en Cordón, Montevideo</strong>, <strong>individuales</strong> y <strong>personalizadas</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* APOYO */}
            <Card className="p-6 border-2 border-cyan-500/50 bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 space-y-4">
              <div className="text-center space-y-2">
                <div className="text-4xl">🟦</div>
                <h3 className="text-2xl font-display font-bold">APOYO</h3>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-2">8 clases</p>
                  <p className="text-4xl font-mono font-bold" style={{ color: '#00d4ff' }}>UYU 3.800</p>
                </div>
                <p className="text-sm text-foreground/80">
                  Ideal para apoyo de tu curso mes a mes.
                </p>
              </div>
              <Button 
                className="w-full glow-green font-semibold"
                style={{ backgroundColor: '#00ff88', color: '#0a1628' }}
                asChild
              >
                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, quiero información sobre la cuponera APOYO (8 clases - UYU 3.800)')}`} target="_blank" rel="noopener noreferrer">
                  Comprar por WhatsApp
                </a>
              </Button>
            </Card>

            {/* NO ENTIENDO */}
            <Card className="p-6 border-2 border-yellow-500/50 bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 space-y-4">
              <div className="text-center space-y-2">
                <div className="text-4xl">⭐</div>
                <h3 className="text-2xl font-display font-bold">NO ENTIENDO</h3>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-2">12 clases</p>
                  <p className="text-4xl font-mono font-bold" style={{ color: '#ffd700' }}>UYU 5.400</p>
                </div>
                <p className="text-sm text-foreground/80">
                  Cuando necesitás algo más para entender todo.
                </p>
              </div>
              <Button 
                className="w-full glow-gold font-semibold"
                style={{ backgroundColor: '#ffd700', color: '#0a1628' }}
                asChild
              >
                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, quiero información sobre la cuponera NO ENTIENDO (12 clases - UYU 5.400)')}`} target="_blank" rel="noopener noreferrer">
                  ¡La quiero!
                </a>
              </Button>
            </Card>

            {/* PREPARA TU EXAMEN */}
            <Card className="p-6 border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 space-y-4 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                ⏳ Cupos limitados
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl">🎓</div>
                <h3 className="text-2xl font-display font-bold">PREPARA TU EXAMEN</h3>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-2">12 clases • Febrero 2026</p>
                  <p className="text-4xl font-mono font-bold" style={{ color: '#ff6b35' }}>UYU 4.800</p>
                </div>
                <p className="text-sm text-foreground/80">
                  <strong>Solo</strong> para exámenes de Febrero 2026. Para llegar seguro y aprobar sí o sí.
                </p>
              </div>
              <Button 
                className="w-full font-semibold"
                style={{ backgroundColor: '#ff6b35', color: '#ffffff' }}
                asChild
              >
                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, quiero información sobre la cuponera PREPARA TU EXAMEN (12 clases - UYU 4.800 - Febrero 2026)')}`} target="_blank" rel="noopener noreferrer">
                  Quiero preparar el examen
                </a>
              </Button>
            </Card>

            {/* EN EL HORNO */}
            <Card className="p-6 border-2 border-red-500/50 bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 space-y-4">
              <div className="text-center space-y-2">
                <div className="text-4xl">🔥</div>
                <h3 className="text-2xl font-display font-bold">EN EL HORNO</h3>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-2">15 clases</p>
                  <p className="text-4xl font-mono font-bold" style={{ color: '#ff6b35' }}>UYU 6.375</p>
                </div>
                <p className="text-sm text-foreground/80">
                  Si sentís que estás "en el horno", esta es tu cuponera.
                </p>
              </div>
              <Button 
                className="w-full glow-green font-semibold"
                style={{ backgroundColor: '#00ff88', color: '#0a1628' }}
                asChild
              >
                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, quiero información sobre la cuponera EN EL HORNO (15 clases - UYU 6.375)')}`} target="_blank" rel="noopener noreferrer">
                  Comprar por WhatsApp
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/QBin1Xve69oQzURzJmzsJd/sandbox/Fa4SeB7ofBXnlfopmEgvMz-img-4_1771392552000_na1fn_c3VjY2Vzcy1jZWxlYnJhdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUJpbjFYdmU2OW9RelVSekptenNKZC9zYW5kYm94L0ZhNFNlQjdvZkJYbmxmb3BtRWd2TXotaW1nLTRfMTc3MTM5MjU1MjAwMF9uYTFmbl9jM1ZqWTJWemN5MWpaV3hsWW5KaGRHbHZiZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=DPEHdEk3t17XSPDnLfbj-08PStrlbo-dcySScC-gztVaPb0-SuAmfj87cOD6dogNxbjAFpn4Hp5ttpijFtKI8zKT4t2x3FS9pbhKYs9agK6yjQWjx-m6yAe91LRGjFxPUYNbf1ioTXsvZAJicAnkPV8plhZfjw04BcXuo5zB0oyULhnptVNugDfa3JG2FW7tCrOoD51eyNw-zkCqbxsgGz~r1f36c3Trn1z282aRqyltEkBTIDQxw6rKR6UtVLqHJrhWcG2ox-gkm6TTiNJXFHhoA5qcclFEaRuX-Z0ejJyqhqfuJ6XWnyCmdtC-Z1cDy4jpFsCJs0-BZYqsksIFQA__')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        <div className="container relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Resultados que <span className="text-glow-gold" style={{ color: '#ffd700' }}>Hablan por Sí Mismos</span>
            </h2>
            <div className="inline-block border-glow-gold rounded-xl px-8 py-4 bg-card/80 backdrop-blur-sm">
              <p className="text-2xl font-bold flex items-center gap-3" style={{ color: '#ffd700' }}>
                <Star className="w-8 h-8 fill-current" />
                ¡Aprobados en Febrero: Todos Menos 1!
                <Star className="w-8 h-8 fill-current" />
              </p>
              <p className="text-3xl font-display font-bold mt-2">¡ÉXITO TOTAL!</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-xl text-foreground/90 leading-relaxed">
              Los resultados de febrero 2026 hablan por sí solos: de todos mis alumnos que rindieron examen, <strong className="text-glow-green" style={{ color: '#00ff88' }}>todos menos uno aprobaron</strong>. Esto no es casualidad, es el resultado de un método probado que combina explicación clara, práctica constante y herramientas tecnológicas que te acompañan 24/7.
            </p>

            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="bg-card/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 space-y-2">
                <div className="text-5xl font-mono font-bold" style={{ color: '#00ff88' }}>10/10</div>
                <p className="text-sm text-muted-foreground">Calificación promedio de aprobados</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 space-y-2">
                <div className="text-5xl font-mono font-bold" style={{ color: '#00d4ff' }}>24/7</div>
                <p className="text-sm text-muted-foreground">Herramientas PEO disponibles</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 space-y-2">
                <div className="text-5xl font-mono font-bold" style={{ color: '#ffd700' }}>+20</div>
                <p className="text-sm text-muted-foreground">Años de experiencia</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground italic pt-8">
              "Si sentís que estás en el horno con Matemática o Física, no estás solo. Con el método correcto y las herramientas adecuadas, <strong>vos también podés aprobar</strong>."
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials/Reviews Section */}
      <section className="py-20 relative">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Lo Que Dicen <span className="text-glow-gold" style={{ color: '#ffd700' }}>Mis Alumnos</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reseñas reales de estudiantes que lograron sus objetivos académicos
            </p>
          </div>

          {/* Platform Ratings */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="p-6 border-glow-cyan bg-card/50 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold">tusclases.com.uy</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#ffd700' }} />
                    ))}
                    <span className="text-2xl font-bold ml-2">5.0</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">17 valoraciones • 100% de 5 estrellas</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-cyan-500/50 hover:bg-cyan-500/10"
                asChild
              >
                <a href="https://www.tusclases.com.uy/profesores/martin-revello.htm" target="_blank" rel="noopener noreferrer">
                  Ver todas las reseñas
                </a>
              </Button>
            </Card>

            <Card className="p-6 border-glow-green bg-card/50 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold">Google Business</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#ffd700' }} />
                    ))}
                    <span className="text-2xl font-bold ml-2">5.0</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Tutoring service • Cordón, Montevideo</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-green-500/50 hover:bg-green-500/10"
                asChild
              >
                <a href="https://g.page/r/Cfq9AleuY-9tEAE/review" target="_blank" rel="noopener noreferrer">
                  Dejar una reseña
                </a>
              </Button>
            </Card>
          </div>

          {/* Featured Reviews */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Review 1 - Eduardo */}
            <Card className="p-6 border-glow-cyan bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-xl font-bold" style={{ color: '#00d4ff' }}>
                  E
                </div>
                <div>
                  <p className="font-semibold">Eduardo</p>
                  <p className="text-xs text-muted-foreground">Enero 2026</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#ffd700' }} />
                ))}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                "Su forma de explicar es espectacular. Recomendable 10 estrellas."
              </p>
              <p className="text-xs text-muted-foreground">Fuente: tusclases.com.uy</p>
            </Card>

            {/* Review 2 - Juan */}
            <Card className="p-6 border-glow-green bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-xl font-bold" style={{ color: '#00ff88' }}>
                  J
                </div>
                <div>
                  <p className="font-semibold">Juan</p>
                  <p className="text-xs text-muted-foreground">Marzo 2025</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#ffd700' }} />
                ))}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                "Recomiendo encarecidamente a Tino a cualquier estudiante que busque no solo aprobar, sino realmente comprender y apreciar la materia. Su dedicación y entusiasmo son contagiosos."
              </p>
              <p className="text-xs text-muted-foreground">Fuente: tusclases.com.uy</p>
            </Card>

            {/* Review 3 - Martin */}
            <Card className="p-6 border-glow-gold bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-xl font-bold" style={{ color: '#ffd700' }}>
                  M
                </div>
                <div>
                  <p className="font-semibold">Martin</p>
                  <p className="text-xs text-muted-foreground">Octubre 2022</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#ffd700' }} />
                ))}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                "Perfecto! le entendí todo de una y saqué 10 !"
              </p>
              <p className="text-xs text-muted-foreground">Fuente: tusclases.com.uy</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-20 relative bg-card/30">
        <div className="container">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              <span className="text-glow-cyan" style={{ color: '#00d4ff' }}>Ubicación</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Jose E Rodo 2270 esquina Juan Paullier, Cordón, Montevideo
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden border-glow-cyan bg-card/50 backdrop-blur-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.0!2d-56.1673939!3d-34.9032107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f8135e4bf7073%3A0x6def63ae5702bdfa!2sElProfeTino!5e0!3m2!1ses!2suy!4v1645000000000!5m2!1ses!2suy"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de ElProfeTino"
              ></iframe>
            </Card>
            <div className="mt-6 text-center">
              <Button 
                className="glow-cyan font-semibold"
                style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}
                asChild
              >
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=-34.9032107,-56.1673939" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Cómo llegar
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 relative">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                ¿Listo para <span className="text-glow-green" style={{ color: '#00ff88' }}>Aprobar</span>?
              </h2>
              <p className="text-xl text-muted-foreground">
                Contactame y empezamos a trabajar juntos en tu éxito académico
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8 border-glow-cyan bg-card/50 backdrop-blur-sm space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="+598 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Materia de interés</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecciona una materia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matematica">Matemática</SelectItem>
                        <SelectItem value="fisica">Física</SelectItem>
                        <SelectItem value="ambas">Ambas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecciona tu nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7-9">7º a 9º</SelectItem>
                        <SelectItem value="bachillerato">Bachillerato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje / Consulta</Label>
                    <Textarea 
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="bg-background/50"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full glow-cyan font-semibold"
                    style={{ backgroundColor: '#00d4ff', color: '#0a1628' }}
                  >
                    Enviar Consulta
                  </Button>
                </form>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <Card className="p-6 border-glow-green bg-card/50 backdrop-blur-sm space-y-4">
                  <h3 className="text-2xl font-display font-bold flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" style={{ color: '#00ff88' }} />
                    Contacto Directo
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#00d4ff' }} />
                      <div>
                        <p className="font-semibold">Ubicación</p>
                        <p className="text-sm text-muted-foreground">Jose E Rodo 2270 esquina Juan Paullier</p>
                        <p className="text-sm text-muted-foreground">Cordón, Montevideo, Uruguay</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#00d4ff' }} />
                      <div>
                        <p className="font-semibold">Teléfono</p>
                        <a href={`tel:+${whatsappNumber}`} className="text-sm text-muted-foreground hover:text-foreground">
                          +598 98 175 225
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 flex-shrink-0" style={{ color: '#00d4ff' }} />
                      <div>
                        <p className="font-semibold">Sitio Web</p>
                        <a href="https://tuplataformaeducativa.online" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                          tuplataformaeducativa.online
                        </a>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full glow-green font-semibold"
                    style={{ backgroundColor: '#00ff88', color: '#0a1628' }}
                    asChild
                  >
                    <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Abrir WhatsApp
                    </a>
                  </Button>
                </Card>

                <Card className="p-6 border-glow-gold bg-card/50 backdrop-blur-sm space-y-4">
                  <h3 className="text-2xl font-display font-bold">Redes Sociales</h3>
                  <div className="flex gap-4">
                    <a 
                      href="https://www.facebook.com/elprofetino" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-background/50 hover:bg-cyan-500/20 transition-colors border border-border"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.instagram.com/elprofetino" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-background/50 hover:bg-cyan-500/20 transition-colors border border-border"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                </Card>

                <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Horarios de atención</p>
                  <p className="font-semibold">Lunes a Viernes:</p>
                  <p className="text-sm">11:00 - 12:00</p>
                  <p className="text-sm">15:00 - 17:00</p>
                  <p className="text-sm">18:00 - 20:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-display font-bold">
                <span className="text-foreground">ElProfe</span>
                <span className="text-glow-cyan" style={{ color: '#00d4ff' }}>Tino</span>
              </h3>
              <p className="text-sm text-muted-foreground">Educación Inteligente • PEO</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-500 transition-colors">
                Inicio
              </button>
              <button onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-cyan-500 transition-colors">
                Herramientas
              </button>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors">
                Contacto
              </a>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>© 2026 ElProfeTino • PEO - Plataforma Educativa Online</p>
              <p className="mt-2">Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
