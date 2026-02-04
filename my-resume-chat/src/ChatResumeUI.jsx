import React, { useState, useRef, useEffect } from 'react';
import { matchIntent } from './utils/intentMatcher';

const ChatResumeUI = () => {
  // Keep all hooks at the top
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi, I am here to tell you all about me, my skills and projects. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Run as messages change

  const handleKeyPress = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents new line
      handleSend();
    }
  };

  const handleSend = () => {
    if(!inputValue.trim()) return; // No empty messages

    // Creating user messages 
    const userMessages = {
        type: 'user',
        content: inputValue,
        timestamp: new Date()
    };

    // Adding user messages to array 
    setMessages(prev=>[...prev, userMessages]);

    // Clear input
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    // Simulating delay 
    setTimeout(() => {
      setIsTyping(false);
      const {response} = matchIntent(userMessages.content);
      const botMessage = {
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  // Render message text and convert plain URLs into clickable anchors
  const renderMessage = (content) => {
    if (typeof content !== 'string') return content;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[85vh]">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-semibold text-gray-800">Shawn Rae's Resume Chat Assistant</h1>
          <p className="text-sm text-gray-500">Feel free to ask about myself, my skills and my projects. I am happy to tell you all about them!</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4 px-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex w-full px-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`message-bubble ${message.type === 'user' ? 'message-user' : 'message-bot'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{renderMessage(message.content)}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 items-center px-0 py-0">
                <div className="flex gap-1">
                  <div className="typing-dot w-4 h-4 rounded-full"></div>
                  <div className="typing-dot w-4 h-4 rounded-full"></div>
                  <div className="typing-dot w-4 h-4 rounded-full"></div>
                </div>
              </div>
            </div>
          )} 
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="px-4 py-4 border-t border-gray-200 bg-white">
          <div className="">
            <div className="flex gap-2 items-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about me, my skills, or my projects..."
                className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="1"
              />

              <button
                onClick={handleSend}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatResumeUI;