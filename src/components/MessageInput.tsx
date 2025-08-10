import React, { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage ,disabled,placeholder}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          rows={1}
          style={{
            height: 'auto',
            minHeight: '20px',
            maxHeight: '120px',
          }}
          disabled={disabled}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />
        
        <button
          className="send-button"
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
