import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage } = useChatbot();
  const { token } = useAuth(); 
  
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };
    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot);
    };
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    addMessage(userMessage, 'user');
    setMessage('');

    try {
      const res = await fetch('http://localhost:8080/api/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error('Error al obtener la respuesta del servidor.');
      }

      const data = await res.json();
      addMessage(data.response, 'bot');

    } catch (error) {
      console.error("Error al contactar al chatbot:", error);
      addMessage("Lo siento, no puedo responder en este momento. Intenta más tarde.", 'bot');
    }
  };

  return (
      <>
        {/* Chatbot boton */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
                isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gold-600 hover:bg-gold-700'
            }`}
        >
          {isOpen ? (
              <X className="text-white" size={24} />
          ) : (
              <MessageCircle className="text-white" size={24} />
          )}
        </button>

        {/* Chatbot ventana */}
        <div
            className={`fixed bottom-24 right-6 z-40 w-80 md:w-96 bg-white rounded-xl shadow-xl transition-all duration-300 transform ${
                isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
            }`}
        >
          {/* Header */}
          <div className="bg-blue-900 text-white p-4 rounded-t-xl">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <div>
                <h3 className="font-bold">Asistente Eclea</h3>
                <p className="text-xs text-blue-100">En línea | Respuesta inmediata</p>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          <div className="p-4 h-80 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <Bot size={40} className="mb-2 text-blue-300" />
                  <p className="mb-1 font-medium">¡Hola! Soy el asistente de Eclea</p>
                  <p className="text-sm">Estoy aquí para responder tus preguntas sobre nuestros servicios de eventos.</p>
                </div>
            ) : (
                messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender === 'user'
                                  ? 'bg-blue-600 text-white rounded-tr-none'
                                  : 'bg-gray-200 text-gray-800 rounded-tl-none'
                          }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs mt-1 opacity-70 block text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                      </div>
                    </div>
                ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
            <div className="flex items-center">
              <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button
                  type="submit"
                  className="px-4 py-2 bg-gold-600 text-white rounded-r-md hover:bg-gold-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Horario de atención personalizada: Lun-Vie 9am-6pm
            </p>
          </form>
        </div>
      </>
  );
};

export default ChatbotWidget;