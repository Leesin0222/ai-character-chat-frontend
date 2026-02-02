import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { Character } from '../characters';

interface MessageListProps {
  messages: Message[];
  selectedCharacter: Character;
  isSending?: boolean;
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedCharacter,
  isSending = false,
}) => {
  const [avatarErrors, setAvatarErrors] = useState<Record<number, boolean>>({});
  const [typingAvatarError, setTypingAvatarError] = useState(false);

  const handleAvatarError = (messageId: number) => {
    setAvatarErrors((prev) => ({ ...prev, [messageId]: true }));
  };

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`message-row message-row-${message.sender} ${
            index === messages.length - 1 ? 'message-row-enter' : ''
          }`}
        >
          {message.sender === 'ai' && (
            <div className="message-avatar">
              {avatarErrors[message.id] ? (
                <div className="message-avatar-fallback">{selectedCharacter.name.charAt(0)}</div>
              ) : (
                <img
                  src={`${import.meta.env.BASE_URL}${selectedCharacter.avatar}`}
                  alt=""
                  onError={() => handleAvatarError(message.id)}
                />
              )}
            </div>
          )}
          <div className={`message-bubble ${message.sender}`}>
            <div className="message-bubble-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
            </div>
            {message.createdAt != null && (
              <span className="message-time">{formatTime(message.createdAt)}</span>
            )}
          </div>
        </div>
      ))}
      {isSending && (
        <div className="message-row message-row-ai message-typing-row">
          <div className="message-avatar">
            {typingAvatarError ? (
              <div className="message-avatar-fallback">{selectedCharacter.name.charAt(0)}</div>
            ) : (
              <img
                src={`${import.meta.env.BASE_URL}${selectedCharacter.avatar}`}
                alt=""
                onError={() => setTypingAvatarError(true)}
              />
            )}
          </div>
          <div className="message-bubble message-bubble-typing ai">
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
