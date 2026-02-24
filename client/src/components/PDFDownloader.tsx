import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

interface PDFDownloaderProps {
  elementId: string;
  fileName: string;
  buttonText?: string;
  className?: string;
}

export const PDFDownloader: React.FC<PDFDownloaderProps> = ({
  elementId,
  fileName,
  buttonText = "📄 Descargar PDF",
  className = "",
}) => {
  const downloadPDF = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      alert("❌ No se encontró el contenido para el PDF");
      return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
      alert("✅ PDF descargado exitosamente!");
    } catch (error) {
      console.error(error);
      alert("❌ Error al generar PDF");
    }
  };

  return (
    <Button onClick={downloadPDF} className={className}>
      <Download className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
};
