import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MIN_ROWS = 1;
const MAX_ROWS = 4;

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 24;
    const rows = Math.min(Math.max(el.value.split('\n').length, MIN_ROWS), MAX_ROWS);
    el.style.height = `${rows * lineHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-group">
      <textarea
        ref={textareaRef}
        className="form-control input-group-textarea"
        placeholder="메시지를 입력하세요... (Enter 전송, Shift+Enter 줄바꿈)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={MIN_ROWS}
      />
      <button type="submit" className="btn btn-primary" disabled={disabled}>
        {disabled ? '전송 중...' : '전송'}
      </button>
    </form>
  );
};

export default MessageInput;
