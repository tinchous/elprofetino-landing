import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const unescapeLatex = (text: string): string => {
    return text
      .replace(/\\\\_/g, "_")
      .replace(/\\\\\\g, "\\\\")
      .replace(/\\\\\{/g, "{")
      .replace(/\\\\\}/g, "}")
      .replace(/\\\\\$/g, "$");
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanContent = unescapeLatex(content);

    let processed = cleanContent.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      try { return katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false }); }
      catch { return match; }
    });

    processed = processed.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
      try { return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false }); }
      catch { return match; }
    });

    containerRef.current.innerHTML = processed;
  }, [content]);

  return <div ref={containerRef} className={`math-renderer prose ${className}`} />;
};



