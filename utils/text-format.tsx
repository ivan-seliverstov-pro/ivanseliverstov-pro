import React from "react";

/**
 * Parses Markdown bold syntax (**text**) and converts it to styled span elements.
 * 
 * @param text The input string containing optional **highlight** markup.
 * @param highlightClassName Tailored CSS classes for highlighted text (default: brand green & font medium).
 */
export function renderFormattedText(
  text: string,
  highlightClassName: string = "text-brand-green font-medium"
): React.ReactNode {
  if (!text) return null;

  const parts = text.split(/(\*\*.*?\*\*|<nobr>.*?<\/nobr>|\[.*?\]\(.*?\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={index} className={highlightClassName}>
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith("<nobr>") && part.endsWith("</nobr>")) {
      return (
        <span key={index} className="whitespace-nowrap">
          {part.slice(6, -7)}
        </span>
      );
    }
    if (part.startsWith("[") && part.endsWith(")") && part.includes("](")) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        const [, label, href] = match;
        if (href.startsWith("#rec:")) {
          const recId = href.replace("#rec:", "");
          return (
            <span
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(
                  new CustomEvent("select-recommendation", { detail: { id: recId } })
                );
              }}
              className="text-brand-green font-medium underline underline-offset-4 hover:opacity-80 hover:no-underline cursor-pointer inline"
            >
              {label}
            </span>
          );
        }
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-green font-medium underline underline-offset-4 hover:opacity-80"
          >
            {label}
          </a>
        );
      }
    }
    return part;
  });
}
