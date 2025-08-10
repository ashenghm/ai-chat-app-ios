import React from 'react';

interface SimpleCodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

const SimpleCodeBlock: React.FC<SimpleCodeBlockProps> = ({ 
  children, 
  language, 
  className 
}) => {
  return (
    <pre className={`code-block ${className || ''}`}>
      <code className={`language-${language || 'text'}`}>
        {children}
      </code>
    </pre>
  );
};

export default SimpleCodeBlock;