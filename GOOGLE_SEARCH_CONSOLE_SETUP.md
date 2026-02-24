# Guía: Enviar Sitemap a Google Search Console

## ✅ Sitemap Implementado

Tu sitio web ahora genera automáticamente un **sitemap.xml dinámico** que incluye todas las páginas importantes:

- **URL del sitemap**: `https://tuplataformaeducativa.online/sitemap.xml`
- **Páginas incluidas**: 
  - Página principal (/)
  - TizaIA (/tizaia)
  - GeneraTusEjercicios (/generatusejercicios)
  - TuExamenPersonal (/tuexamenpersonal)
  - Dashboard (/dashboard)

El sitemap se actualiza automáticamente con la fecha actual cada vez que se accede.

---

## 📋 Instrucciones para Google Search Console

### Paso 1: Acceder a Google Search Console

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Inicia sesión con tu cuenta de Google
3. Si es la primera vez, deberás **verificar la propiedad** de tu sitio web

### Paso 2: Verificar la Propiedad del Sitio (si aún no lo has hecho)

**Opción recomendada: Verificación por archivo HTML**

1. En Google Search Console, selecciona "Agregar propiedad"
2. Ingresa la URL: `https://tuplataformaeducativa.online`
3. Elige el método "Archivo HTML"
4. Google te dará un archivo para descargar (ej: `google1234567890abcdef.html`)
5. **Sube este archivo** a la carpeta `client/public/` de tu proyecto
6. El archivo estará disponible en: `https://tuplataformaeducativa.online/google1234567890abcdef.html`
7. Haz clic en "Verificar" en Google Search Console

**Alternativa: Verificación por etiqueta HTML**

1. Copia la etiqueta meta que Google te proporciona
2. Agrégala en el `<head>` del archivo `client/index.html`
3. Haz clic en "Verificar"

### Paso 3: Enviar el Sitemap

Una vez verificada la propiedad:

1. En el menú lateral izquierdo, ve a **"Sitemaps"**
2. En el campo "Agregar un nuevo sitemap", ingresa: `sitemap.xml`
3. Haz clic en **"Enviar"**

✅ ¡Listo! Google comenzará a rastrear e indexar tus páginas automáticamente.

---

## 📊 Monitoreo y Seguimiento

Después de enviar el sitemap, puedes monitorear el progreso en Google Search Console:

### Sección "Sitemaps"
- **Estado**: Debe aparecer como "Correcto"
- **URLs descubiertas**: Verás cuántas URLs detectó Google (debería ser 5)
- **Última lectura**: Fecha en que Google leyó el sitemap por última vez

### Sección "Cobertura" (o "Indexación de páginas")
- **Páginas válidas**: Muestra cuántas páginas se indexaron correctamente
- **Páginas excluidas**: Páginas que Google decidió no indexar
- **Errores**: Problemas que impiden la indexación

### Tiempo de indexación
- **Primeras 24-48 horas**: Google descubre las URLs
- **1-2 semanas**: Indexación completa de todas las páginas
- **Aceleración**: Puedes usar "Solicitar indexación" para páginas específicas

---

## 🚀 Acelerar la Indexación (Opcional)

Para indexar páginas más rápido:

1. Ve a la sección **"Inspección de URLs"** en Google Search Console
2. Ingresa la URL completa de una página (ej: `https://tuplataformaeducativa.online/tizaia`)
3. Haz clic en **"Solicitar indexación"**
4. Repite para cada página importante

**Límite**: Puedes solicitar indexación de ~10 URLs por día.

---

## 📈 Beneficios del Sitemap

✅ **Indexación más rápida**: Google descubre tus páginas automáticamente  
✅ **Mejor rastreo**: Indica la frecuencia de actualización de cada página  
✅ **Prioridades claras**: Google sabe qué páginas son más importantes  
✅ **Monitoreo**: Recibes alertas si hay problemas de indexación  

---

## 🔧 Mantenimiento

El sitemap es **completamente automático**. No necesitas hacer nada más:

- ✅ Se actualiza solo con la fecha actual
- ✅ Incluye todas las páginas principales
- ✅ Las prioridades están optimizadas (1.0 para home, 0.9 para herramientas PEO)
- ✅ Las frecuencias de cambio están configuradas (weekly, monthly, daily)

Si agregas nuevas páginas en el futuro, simplemente actualiza el archivo `server/sitemap.ts` para incluirlas.

---

## 📞 Soporte

Si tienes problemas con la verificación o el envío del sitemap:

1. Revisa la [documentación oficial de Google Search Console](https://support.google.com/webmasters/answer/9008080)
2. Verifica que el sitemap esté accesible: `https://tuplataformaeducativa.online/sitemap.xml`
3. Usa la herramienta de [prueba de sitemaps de Google](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

---

**¡Tu sitio está listo para ser indexado por Google! 🎉**
