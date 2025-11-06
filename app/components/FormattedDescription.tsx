'use client';

interface FormattedDescriptionProps {
  text: string;
  className?: string;
}

export default function FormattedDescription({ text, className = '' }: FormattedDescriptionProps) {
  const formatText = (input: string) => {
    const elements: React.ReactNode[] = [];
    let elementIndex = 0;

    // Split by code blocks first (```...```)
    const codeBlockRegex = /```([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(input)) !== null) {
      // Process text before code block
      if (match.index > lastIndex) {
        const textBefore = input.slice(lastIndex, match.index);
        elements.push(...processParagraphs(textBefore, elementIndex));
        elementIndex += textBefore.split(/\n\n+/).length;
      }

      // Add code block
      elements.push(
        <pre
          key={`code-${elementIndex++}`}
          className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm"
        >
          <code>{match[1].trim()}</code>
        </pre>
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    // Process remaining text
    if (lastIndex < input.length) {
      const remainingText = input.slice(lastIndex);
      elements.push(...processParagraphs(remainingText, elementIndex));
    }

    return elements;
  };

  const processParagraphs = (text: string, startIndex: number) => {
    // Split by double line breaks for paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    
    return paragraphs.map((paragraph, pIndex) => {
      const index = startIndex + pIndex;
      
      // Process inline formatting
      const parts: React.ReactNode[] = [];
      let lastIdx = 0;
      
      // Combined regex for bold, italic, and inline code
      const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)/g;
      let m;
      
      while ((m = regex.exec(paragraph)) !== null) {
        // Add text before the match
        if (m.index > lastIdx) {
          parts.push(paragraph.slice(lastIdx, m.index));
        }
        
        if (m[1]) {
          // Bold **text**
          parts.push(<strong key={`b-${index}-${m.index}`}>{m[2]}</strong>);
        } else if (m[3]) {
          // Italic *text*
          parts.push(<em key={`i-${index}-${m.index}`}>{m[4]}</em>);
        } else if (m[5]) {
          // Inline code `text`
          parts.push(
            <code 
              key={`c-${index}-${m.index}`}
              className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
            >
              {m[6]}
            </code>
          );
        }
        
        lastIdx = regex.lastIndex;
      }
      
      // Add remaining text
      if (lastIdx < paragraph.length) {
        parts.push(paragraph.slice(lastIdx));
      }
      
      return (
        <p key={`p-${index}`} className="mb-4 last:mb-0">
          {parts}
        </p>
      );
    });
  };

  return (
    <div className={className}>
      {formatText(text)}
    </div>
  );
}
