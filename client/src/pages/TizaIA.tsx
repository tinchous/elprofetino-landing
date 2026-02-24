import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import TizaIAChat from "@/components/TizaIAChat";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function TizaIA() {
  const { isAuthenticated, loading } = useAuth();

  // Set page title and structured data for SEO
  useEffect(() => {
    document.title = "TizaIA - Asistente Educativo con IA | ElProfeTino";

    // Add Course structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "TizaIA - Asistente Educativo con Inteligencia Artificial",
      "description": "Herramienta de IA educativa disponible 24/7 que responde dudas y explica temas, fórmulas y procedimientos de Matemática y Física con lenguaje claro y ejemplos reales.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "ElProfeTino",
        "url": "https://tuplataformaeducativa.online",
        "telephone": "+59898175225",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jose E Rodo 2270",
          "addressLocality": "Montevideo",
          "addressCountry": "UY"
        }
      },
      "educationalLevel": "Secundaria y Bachillerato",
      "inLanguage": "es",
      "availableLanguage": "Spanish",
      "isAccessibleForFree": false,
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "courseWorkload": "PT24H"
      },
      "offers": {
        "@type": "Offer",
        "category": "Incluido en cuponeras",
        "priceCurrency": "UYU",
        "price": "3800",
        "availability": "https://schema.org/InStock"
      },
      "teaches": ["Matemática", "Física"],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "ratingCount": "17",
        "bestRating": "5",
        "worstRating": "1"
      }
    });
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Back Button */}
        <div className="container py-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* Login Required Message */}
        <div className="container py-20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/QBin1Xve69oQzURzJmzsJd/sandbox/Fa4SeB7ofBXnlfopmEgvMz_1771392552783_na1fn_dGl6YWlhLXJvYm90.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUUJpbjFYdmU2OW9RelVSekptenNKZC9zYW5kYm94L0ZhNFNlQjdvZkJYbmxmb3BtRWd2TXpfMTc3MTM5MjU1Mjc4M19uYTFmbl9kR2w2WVdsaExYSnZZbTkwLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LG2g9c4YqNoj5ZThts7wo3nTkHeLSA6ZPAa6QtiUbF7NNVMrsuXqXjD~973Geyoac5AIeZPvvrC2L-nCOue6aAx0xqbLYEid~PfZ3s5XiLhu4JVAgcQw30ZOor6wy-ijfJXyeONxBMFCrH3DJYzISArUxRocmtd4F~8U4ej3rziI9cSWm3DcALpfKIKyGtHZv4HfPOFBC3PjNdrKtJVdeCYaxhZ6lowWIvjlmC-hbZHS5E1HwqK2irIA6RxRmiSLWDq5LN9ginSbW8dHYOpNLfVr7OC-6QbHfgKSSNm8wmF-nC7GSEXTOt5VZnMaYtQU7azJWMDHt4ESlLxYx-sNcQ__"
                alt="TizaIA"
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold" style={{ color: "#00d4ff" }}>
              TizaIA
            </h1>
            <p className="text-xl text-muted-foreground">
              Tu Asistente Educativo con Inteligencia Artificial
            </p>
            <div className="bg-card border border-border rounded-lg p-8 space-y-4">
              <p className="text-lg">
                Para acceder a TizaIA necesitas iniciar sesión
              </p>
              <Button
                size="lg"
                style={{ backgroundColor: "#00d4ff", color: "#0a1628" }}
                onClick={() => window.location.href = getLoginUrl()}
              >
                Iniciar Sesión
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              TizaIA está incluido en las cuponeras de ElProfeTino. Si ya eres estudiante, inicia sesión para comenzar a usar tu asistente educativo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Back Button */}
      <div className="container py-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>

      {/* Chat Section */}
      <div className="container pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-foreground">Tiza</span>
            <span style={{ color: "#00d4ff" }}>IA</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Tu Asistente Educativo con Inteligencia Artificial
          </p>
        </div>

        <TizaIAChat />
      </div>
    </div>
  );
}
