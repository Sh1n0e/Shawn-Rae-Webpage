import React, { useState, useRef, useEffect } from 'react';

const ChatResumeUI = () => {
  // Keep all hooks at the top
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi, I am here to tell you all about my skills and projects. What would you like to know?",
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
      const botMessage = {
        type: 'bot',
        content: "This is a placeholder response. Connect your JSON data here!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Resume Chat Assistant</h1>
        <p className="text-sm text-gray-500">Ask about my skills, experience, and projects</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-end">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about my skills, projects, or experience..."
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
  );
};

export default ChatResumeUI;