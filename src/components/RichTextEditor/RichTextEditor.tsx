'use client';

import { useRef, useState, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // For IME support
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Update counts when content changes
  const updateCounts = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.split(/\s+/).filter(Boolean).length;
      const chars = text.length;
      setWordCount(words);
      setCharCount(chars);
    }
  };


  const executeCommand = (command: string, value?: string | boolean) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value as string);
      updateContent();
    }
  };

  const updateContent = () => {
    if (editorRef.current && !isComposing) {
      const newContent = editorRef.current.innerHTML;
      // Only update if content has actually changed to prevent infinite loops
      if (newContent !== content) {
        onChange(newContent);
        updateCounts();
      }
    }
  };

  // Initialize editor content only once
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '' && content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (editorRef.current) {
      const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
      document.execCommand('insertHTML', false, text);
      updateContent();
      updateCounts();
    }
  };

  const handleInput = () => {
    // Don't update during IME composition
    if (!isComposing) {
      updateContent();
      updateCounts();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
    // Update content after composition ends
    setTimeout(() => {
      updateContent();
      updateCounts();
    }, 0);
  };

  const toolbarButtonClass = 'relative group px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1';
  const toolbarGroupSeparator = 'w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Toolbar Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-700 flex items-center">
          <svg className="h-5 w-5 text-emerald-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Content Editor
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
          <span className="text-xs text-gray-500">Editing</span>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex flex-wrap gap-2">
        {/* Text Formatting Group */}
        <div className="flex gap-1 items-center">
          <button type="button" onClick={() => executeCommand('bold')} className={`${toolbarButtonClass} font-bold`} title="Bold (Ctrl+B)">
            B
          </button>

          <button type="button" onClick={() => executeCommand('italic')} className={`${toolbarButtonClass} italic`} title="Italic (Ctrl+I)">
            I
          </button>

          <button type="button" onClick={() => executeCommand('underline')} className={`${toolbarButtonClass} underline`} title="Underline (Ctrl+U)">
            U
          </button>

          <button type="button" onClick={() => executeCommand('strikeThrough')} className={`${toolbarButtonClass} line-through`} title="Strikethrough">
            S
          </button>
        </div>

        <div className={toolbarGroupSeparator}></div>

        {/* Headings */}
        <div className="flex gap-1 items-center">
          <button type="button" onClick={() => executeCommand('formatBlock', 'h1')} className={toolbarButtonClass} title="Heading 1">
            <span className="text-lg font-bold">H1</span>
          </button>

          <button type="button" onClick={() => executeCommand('formatBlock', 'h2')} className={toolbarButtonClass} title="Heading 2">
            <span className="text-base font-bold">H2</span>
          </button>

          <button type="button" onClick={() => executeCommand('formatBlock', 'h3')} className={toolbarButtonClass} title="Heading 3">
            <span className="text-sm font-bold">H3</span>
          </button>
        </div>

        <div className={toolbarGroupSeparator}></div>

        {/* Lists & Indentation */}
        <div className="flex gap-1 items-center">
          <button type="button" onClick={() => executeCommand('insertUnorderedList')} className={toolbarButtonClass} title="Bullet List">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button type="button" onClick={() => executeCommand('insertOrderedList')} className={toolbarButtonClass} title="Numbered List">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button type="button" onClick={() => executeCommand('indent')} className={toolbarButtonClass} title="Increase Indent">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button type="button" onClick={() => executeCommand('outdent')} className={toolbarButtonClass} title="Decrease Indent">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className={toolbarGroupSeparator}></div>

        {/* Alignment */}
        <div className="flex gap-1 items-center">
          <button type="button" onClick={() => executeCommand('justifyLeft')} className={toolbarButtonClass} title="Align Left">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h12" />
            </svg>
          </button>

          <button type="button" onClick={() => executeCommand('justifyCenter')} className={toolbarButtonClass} title="Align Center">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button type="button" onClick={() => executeCommand('justifyRight')} className={toolbarButtonClass} title="Align Right">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h12" />
            </svg>
          </button>
        </div>

        <div className={toolbarGroupSeparator}></div>

        {/* Media */}
        <div className="flex gap-1 items-center">
          <button
            type="button"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) executeCommand('createLink', url);
            }}
            className={toolbarButtonClass}
            title="Insert Link"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={`w-full min-h-96 p-6 focus:outline-none text-gray-800 bg-white overflow-auto text-base leading-relaxed ${isFocused ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''}`}
        style={{
          fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
          lineHeight: '1.6',
          direction: 'ltr', // Force left-to-right typing
          textAlign: 'left', // Ensure text alignment is left
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          hyphens: 'auto'
        }}
      />

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-4 py-2 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center">
          <span className="flex items-center mr-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
            {isFocused ? 'Editing' : 'Ready'}
          </span>
          <span>Words: {wordCount}</span>
          <span className="mx-2">•</span>
          <span>Characters: {charCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          All changes saved
        </div>
      </div>

      <style jsx>{`
        div[contenteditable] {
          outline: none;
        }

        div[contenteditable] h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0.5em 0;
          color: #1e293b;
        }

        div[contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.4em 0;
          color: #1e293b;
        }

        div[contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0.3em 0;
          color: #1e293b;
        }

        div[contenteditable] p {
          margin: 0.5em 0;
          color: #334155;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        div[contenteditable] ul,
        div[contenteditable] ol {
          margin: 0.5em 0 0.5em 1.5em;
          color: #334155;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        div[contenteditable] li {
          margin: 0.25em 0;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        div[contenteditable] blockquote {
          border-left: 4px solid #0ea5e9;
          padding: 0.5em 1em;
          margin: 0.5em 0;
          background-color: #f0f9ff;
          color: #0c4a6e;
          font-style: italic;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        div[contenteditable] a {
          color: #0ea5e9;
          text-decoration: underline;
          cursor: pointer;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        div[contenteditable] a:hover {
          color: #0284c7;
        }

        div[contenteditable] code {
          background-color: #f1f5f9;
          padding: 0.2em 0.4em;
          border-radius: 0.375rem;
          font-family: 'Monaco', 'Menlo', monospace;
          color: #dc2626;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        div[contenteditable] table {
          width: 100%;
          margin: 1em 0;
          border-collapse: collapse;
          table-layout: fixed;
        }

        div[contenteditable] th,
        div[contenteditable] td {
          border: 1px solid #cbd5e1;
          padding: 0.5em;
          text-align: left;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        div[contenteditable] th {
          background-color: #f1f5f9;
          font-weight: bold;
        }

        div[contenteditable]:focus {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
}