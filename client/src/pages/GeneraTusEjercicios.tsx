/* Design: Cosmic Education - Futurismo Educativo Espacial
   Colors: Space Navy (#0a1628), Cyan (#00d4ff), Gold (#ffd700), Green (#00ff88)
   Typography: Space Grotesk (display), Inter (body)
   Layout: Asymmetric, floating cards, diagonal sections
*/

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { GTEChat } from "@/components/GTEChat";

export default function GeneraTusEjercicios() {
  const { isAuthenticated, loading } = useAuth();

  // Set page title and structured data for SEO
  useEffect(() => {
    document.title = "GeneraTusEjercicios - Práctica Ilimitada | ElProfeTino";

    // Add Course structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "GeneraTusEjercicios - Práctica Ilimitada Adaptada a Tu Nivel",
      "description": "Herramienta de IA que genera ejercicios de práctica ilimitados de Matemática y Física, adaptados a tu nivel. Entrena hasta dominar cada tema con ejercicios similares personalizados.",
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
        "price": "0",
        "priceCurrency": "UYU",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "17"
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-bold">GeneraTusEjercicios</h1>
          <p className="text-muted-foreground">
            Debes iniciar sesión para acceder a esta herramienta
          </p>
          <Button
            asChild
            className="w-full"
            style={{ backgroundColor: "#00ff88", color: "#0a1628" }}
          >
            <a href={getLoginUrl()}>Iniciar Sesión</a>
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            <span className="text-foreground">Genera</span>
            <span className="text-foreground">Tus</span>
            <span style={{ color: "#00ff88" }}>Ejercicios</span>
          </h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Description */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold">Práctica Ilimitada</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Genera ejercicios de práctica adaptados a tu nivel. Especifica el tema, nivel de dificultad y cantidad.
              Puedes adjuntar archivos o tomar fotos de ejercicios similares que quieras practicar.
            </p>
          </div>

          {/* GTE Chat Component */}
          <GTEChat />
        </div>
      </div>
    </div>
  );
}


