import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiSend, FiLoader, FiUser, FiBrain } from 'react-icons/fi';
import apiService from '../../services/apiService';

const DoubtSolver = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const messagesEndRef = useRef(null);

  // Sample subject categories
  const subjects = [
    'Mathematics', 
    'Physics', 
    'Chemistry', 
    'Biology', 
    'History', 
    'Geography', 
    'Literature',
    'Computer Science',
    'Economics',
    'Psychology',
    'General'
  ];

  // Sample AI greeting based on subject
  useEffect(() => {
    if (subject) {
      setMessages([
        {
          role: 'assistant',
          content: `I'm your AI assistant for ${subject}. What would you like help with today?`
        }
      ]);
    }
  }, [subject]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubjectChange = (selectedSubject) => {
    setSubject(selectedSubject);
    setMessages([]);
    setInput('');
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !subject) return;
    
    const userMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await apiService.post('/ai/doubt-solver', {
        message: input,
        subject: subject,
        history: messages
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }]);
      
    } catch (err) {
      console.error('Error getting AI response:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // If no subject is selected, show subject selection screen
  if (!subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-primary font-medium mb-8 hover:underline"
        >
          <FiChevronLeft className="mr-1" /> Back to Dashboard
        </button>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">AI Doubt Solver</h1>
            <p className="text-gray-600">Get instant answers to your academic questions</p>
          </div>
          
          <div className="bg-white border-3 border-black p-8 shadow-neubrutalism">
            <h2 className="text-xl font-bold mb-6">Select a subject to begin</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => handleSubjectChange(subj)}
                  className="p-4 border-3 border-black text-center bg-white hover:bg-primary hover:text-white shadow-neubrutalism-sm transition-colors"
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-primary font-medium mb-8 hover:underline"
      >
        <FiChevronLeft className="mr-1" /> Back to Dashboard
      </button>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">AI Doubt Solver - {subject}</h1>
          <button
            onClick={() => setSubject('')}
            className="btn-neubrutalism-secondary"
          >
            Change Subject
          </button>
        </div>
        
        <div className="bg-white border-3 border-black shadow-neubrutalism flex flex-col h-[70vh]">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FiBrain className="text-5xl text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Ask me anything about {subject}</h3>
                <p className="text-gray-600 max-w-md">
                  I can help explain concepts, solve problems, or answer questions related to {subject}.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3/4 p-4 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white ml-12' 
                          : 'bg-gray-100 text-gray-800 mr-12 border-3 border-black'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                          msg.role === 'user' 
                            ? 'bg-white text-primary' 
                            : 'bg-black text-white'
                        }`}>
                          {msg.role === 'user' ? <FiUser /> : <FiBrain />}
                        </div>
                        <span className="font-bold">
                          {msg.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask your question about ${subject}...`}
                className="input-neubrutalism flex-1 min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="btn-neubrutalism-primary ml-2 self-end"
              >
                {isLoading ? <FiLoader className="animate-spin" /> : <FiSend />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send. Use Shift+Enter for a new line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtSolver; 