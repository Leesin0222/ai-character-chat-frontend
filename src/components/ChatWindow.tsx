import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from '../types';
import { Character } from '../characters';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

interface ChatWindowProps {
  selectedCharacter: Character;
  onBackToSelection: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedCharacter, onBackToSelection }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [headerAvatarError, setHeaderAvatarError] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const messageIdRef = useRef(0);
  const nextMessageId = () => ++messageIdRef.current;

  const clientId = `${sessionIdRef.current}-${selectedCharacter.id}`;

  useEffect(() => {
    const now = Date.now();
    setMessages([
      {
        id: nextMessageId(),
        text: `${selectedCharacter.name}이(가) 등장했습니다! 무엇이든 물어보세요.`,
        sender: 'ai',
        createdAt: now,
      },
    ]);
  }, [selectedCharacter]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isSending]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    const now = Date.now();
    const newUserMessage: Message = { id: nextMessageId(), text, sender: 'user', createdAt: now };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          persona: selectedCharacter.persona,
          clientId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        const errorText =
          typeof data?.error === 'string' ? data.error : '응답을 받지 못했습니다. 다시 시도해 주세요.';
        setMessages((prev) => [
          ...prev,
          { id: nextMessageId(), text: `오류: ${errorText}`, sender: 'ai', createdAt: Date.now() },
        ]);
        return;
      }

      const reply = data?.reply ?? '응답이 비어 있습니다.';
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), text: reply, sender: 'ai', createdAt: Date.now() },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId(),
          text: '오류: 네트워크 또는 서버 문제로 응답을 받지 못했습니다.',
          sender: 'ai',
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="card chat-window chat-window-enter">
      <div className="chat-window-header">
        <button
          type="button"
          className="btn btn-sm btn-light chat-header-back"
          onClick={onBackToSelection}
          aria-label="캐릭터 선택으로 돌아가기"
        >
          &lt; 뒤로
        </button>
        <div className="chat-window-header-center">
          {headerAvatarError ? (
            <div className="chat-header-avatar chat-header-avatar-fallback">
              {selectedCharacter.name.charAt(0)}
            </div>
          ) : (
            <img
              src={`${import.meta.env.BASE_URL}${selectedCharacter.avatar}`}
              alt=""
              className="chat-header-avatar"
              onError={() => setHeaderAvatarError(true)}
            />
          )}
          <h4 className="mb-0">{selectedCharacter.name}</h4>
        </div>
        <div className="chat-window-header-end" aria-hidden />
      </div>
      <div className="card-body message-list-container" ref={chatWindowRef}>
        <MessageList
          messages={messages}
          selectedCharacter={selectedCharacter}
          isSending={isSending}
        />
      </div>
      <div className="chat-window-footer">
        <MessageInput onSendMessage={handleSendMessage} disabled={isSending} />
      </div>
    </div>
  );
};

export default ChatWindow;
