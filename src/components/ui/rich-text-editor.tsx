import React, { useState, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Введите текст...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleFocus = () => {
    setIsToolbarVisible(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsToolbarVisible(false), 200);
  };

  const insertImage = () => {
    const url = prompt('Введите URL изображения:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { command: 'bold', icon: 'Bold', title: 'Жирный' },
    { command: 'italic', icon: 'Italic', title: 'Курсив' },
    { command: 'underline', icon: 'Underline', title: 'Подчеркнутый' },
    { command: 'strikeThrough', icon: 'Strikethrough', title: 'Зачеркнутый' },
    { command: 'separator' },
    { command: 'insertUnorderedList', icon: 'List', title: 'Маркированный список' },
    { command: 'insertOrderedList', icon: 'ListOrdered', title: 'Нумерованный список' },
    { command: 'separator' },
    { command: 'justifyLeft', icon: 'AlignLeft', title: 'По левому краю' },
    { command: 'justifyCenter', icon: 'AlignCenter', title: 'По центру' },
    { command: 'justifyRight', icon: 'AlignRight', title: 'По правому краю' },
    { command: 'separator' },
    { command: 'insertImage', icon: 'Image', title: 'Вставить изображение', onClick: insertImage },
    { command: 'createLink', icon: 'Link', title: 'Вставить ссылку', onClick: () => {
      const url = prompt('Введите URL:');
      if (url) execCommand('createLink', url);
    }},
  ];

  return (
    <div className={`relative border border-gray-300 rounded-lg ${className}`}>
      {isToolbarVisible && (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
          {toolbarButtons.map((button, index) => {
            if (button.command === 'separator') {
              return <div key={index} className="w-px bg-gray-300 mx-1 self-stretch" />;
            }
            
            return (
              <button
                key={button.command}
                type="button"
                title={button.title}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (button.onClick) {
                    button.onClick();
                  } else {
                    execCommand(button.command);
                  }
                }}
              >
                <Icon name={button.icon as any} size={16} />
              </button>
            );
          })}
        </div>
      )}
      
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[120px] p-3 outline-none focus:ring-2 focus:ring-gorkhon-pink/20 rounded-b-lg"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-placeholder={placeholder}
        style={{
          WebkitUserModify: 'read-write-plaintext-only'
        }}
      />
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;