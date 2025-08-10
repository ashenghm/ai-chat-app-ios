import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="message ai">
      <div className="message-avatar">AI</div>
      <div className="message-bubble">
        <div className="typing-indicator">
          正在输入
          <div className="typing-dots">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
