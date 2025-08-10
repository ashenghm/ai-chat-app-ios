// 修复 react-syntax-highlighter 和 react-markdown 的类型兼容性问题

declare module 'react-syntax-highlighter' {
  import { Component } from 'react';
  
  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    customStyle?: any;
    codeTagProps?: any;
    useInlineStyles?: boolean;
    showLineNumbers?: boolean;
    showInlineLineNumbers?: boolean;
    startingLineNumber?: number;
    lineNumberContainerStyle?: any;
    lineNumberStyle?: any;
    wrapLines?: boolean;
    wrapLongLines?: boolean;
    lineProps?: any;
    renderer?: any;
    PreTag?: string | Component<any>;
    CodeTag?: string | Component<any>;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export class Prism extends Component<SyntaxHighlighterProps> {}
  export default class SyntaxHighlighter extends Component<SyntaxHighlighterProps> {}
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const tomorrow: any;
  export { tomorrow };
}

declare module 'react-markdown' {
  import { ReactNode } from 'react';
  
  export interface Components {
    [key: string]: React.ComponentType<any>;
  }
  
  export interface ReactMarkdownProps {
    children: string;
    components?: Components;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    className?: string;
  }
  
  declare const ReactMarkdown: React.FC<ReactMarkdownProps>;
  export default ReactMarkdown;
}
