import React from 'react';

interface PageDisplayProps {
  content: string;
  title?: string;
  className?: string;
}

const PageDisplay: React.FC<PageDisplayProps> = ({ content, title, className = '' }) => {
  return (
    <div className={`page-display ${className}`}>
      {title && (
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      )}
      <div 
        className="rich-content max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <style>{`
        .rich-content {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
        }
        .rich-content h1 { font-size: 2.5em; color: #2c3e50; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
        .rich-content h2 { font-size: 2em; color: #34495e; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
        .rich-content h3 { font-size: 1.7em; color: #34495e; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
        .rich-content h4 { font-size: 1.4em; color: #34495e; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
        .rich-content h5 { font-size: 1.2em; color: #34495e; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
        .rich-content h6 { font-size: 1em; color: #34495e; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
        .rich-content p { margin-bottom: 1em; }
        .rich-content blockquote {
          border-left: 4px solid #3498db;
          margin: 1.5em 0;
          font-style: italic;
          background-color: #f8f9fa;
          padding: 15px 20px;
        }
        .rich-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        .rich-content table, .rich-content th, .rich-content td {
          border: 1px solid #ddd;
        }
        .rich-content th, .rich-content td {
          padding: 12px;
          text-align: left;
        }
        .rich-content th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .rich-content code {
          background-color: #f4f4f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        .rich-content pre {
          background-color: #f4f4f4;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
          margin: 1em 0;
        }
        .rich-content ul, .rich-content ol {
          padding-left: 30px;
          margin: 1em 0;
        }
        .rich-content li {
          margin-bottom: 0.5em;
        }
        .rich-content img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
        }
        .rich-content strong {
          font-weight: bold;
        }
        .rich-content em {
          font-style: italic;
        }
        .rich-content u {
          text-decoration: underline;
        }
        .rich-content del {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
};

export default PageDisplay; 