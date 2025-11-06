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

      // Check for headings
      if (paragraph.startsWith('# ')) {
        const headingText = paragraph.slice(2);
        return (
          <h1 key={`h1-${index}`} className="text-3xl font-bold mb-4 mt-6">
            {processInlineFormatting(headingText, index)}
          </h1>
        );
      }

      if (paragraph.startsWith('## ')) {
        const headingText = paragraph.slice(3);
        return (
          <h2 key={`h2-${index}`} className="text-2xl font-bold mb-3 mt-5">
            {processInlineFormatting(headingText, index)}
          </h2>
        );
      }

      // Check for images ![alt](src)
      const imageRegex = /^!\[(.*?)\]\((.*?)\)$/;
      const imageMatch = paragraph.match(imageRegex);
      if (imageMatch) {
        return (
          <img
            key={`img-${index}`}
            src={imageMatch[2]}
            alt={imageMatch[1]}
            className="max-w-full h-auto rounded-lg my-4"
          />
        );
      }

      // Regular paragraph with inline formatting
      return (
        <p key={`p-${index}`} className="mb-4 last:mb-0">
          {processInlineFormatting(paragraph, index)}
        </p>
      );
    });
  };

  const processInlineFormatting = (text: string, index: number) => {
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;

    // Combined regex for bold, italic, and inline code
    const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)/g;
    let m;

    while ((m = regex.exec(text)) !== null) {
      // Add text before the match
      if (m.index > lastIdx) {
        parts.push(text.slice(lastIdx, m.index));
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
    if (lastIdx < text.length) {
      parts.push(text.slice(lastIdx));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={className}>
      {formatText(text)}
    </div>
  );
}
