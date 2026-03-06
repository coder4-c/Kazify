import React, { useState } from 'react';

// AI Chatbot Component
export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I\'m Kazify AI Assistant. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), type: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);

    // Get AI response
    const botResponse = getBotResponse(inputText);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse }]);
    }, 500);

    setInputText('');
  };

  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('job') || lowerInput.includes('work') || lowerInput.includes('employment')) {
      return 'Kazify offers thousands of job opportunities from top employers in Kenya and globally. Go to the Jobs section to browse available positions!';
    } else if (lowerInput.includes('internship') || lowerInput.includes('intern')) {
      return 'We have various internship opportunities available. Check our Internships section to find programs that match your skills and interests.';
    } else if (lowerInput.includes('scholarship') || lowerInput.includes('grant') || lowerInput.includes('funding')) {
      return 'Kazify lists various scholarships and grants for Kenyan youth. Visit our Scholarships section to explore funding opportunities for your education.';
    } else if (lowerInput.includes('training') || lowerInput.includes('course') || lowerInput.includes('learn')) {
      return 'We offer digital skills, entrepreneurship, and technical training programs. Check the Training section to start learning new skills!';
    } else if (lowerInput.includes('marketplace') || lowerInput.includes('sell') || lowerInput.includes('business')) {
      return 'Our Marketplace allows you to sell products and services to a nationwide audience. Create an account to start your business today!';
    } else if (lowerInput.includes('profile') || lowerInput.includes('resume') || lowerInput.includes('cv')) {
      return 'Create your profile in the Youth Profiles section to let employers find you! Add your skills and experience to increase your chances.';
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return 'Hello! Welcome to Kazify. How can I assist you today?';
    } else if (lowerInput.includes('about') || lowerInput.includes('what is')) {
      return 'Kazify is your gateway to employment, training, and entrepreneurship opportunities in Kenya. We connect youth with jobs, internships, scholarships, and more!';
    } else if (lowerInput.includes('contact') || lowerInput.includes('help') || lowerInput.includes('support')) {
      return 'For support, please email us at support@kazify.com or use the contact form on our website.';
    } else {
      return 'I\'m here to help! Ask me about jobs, internships, scholarships, training programs, or marketplace opportunities.';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={styles.chatbotContainer}>
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <span>🤖 Kazify AI Assistant</span>
            <button style={styles.closeBtn} onClick={toggleChat}>✕</button>
          </div>
          <div style={styles.chatMessages}>
            {messages.map(msg => (
              <div key={msg.id} style={msg.type === 'user' ? styles.userMessage : styles.botMessage}>
                <span style={msg.type === 'user' ? styles.userIcon : styles.botIcon}>
                  {msg.type === 'user' ? '👤' : '🤖'}
                </span>
                <span style={styles.messageText}>{msg.text}</span>
              </div>
            ))}
          </div>
          <div style={styles.chatInput}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.sendBtn}>Send</button>
          </div>
        </div>
      )}
      
      <button style={styles.chatButton} onClick={toggleChat}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}

const styles = {
  chatbotContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  },
  chatButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatWindow: {
    position: 'absolute',
    bottom: '70px',
    right: '0',
    width: '350px',
    height: '450px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatHeader: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
  },
  chatMessages: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  userMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  botMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    justifyContent: 'flex-start',
  },
  userIcon: {
    fontSize: '16px',
  },
  botIcon: {
    fontSize: '16px',
  },
  messageText: {
    backgroundColor: '#f0f0f0',
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '14px',
    maxWidth: '80%',
    lineHeight: '1.4',
  },
  chatInput: {
    padding: '15px',
    borderTop: '1px solid #eee',
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    outline: 'none',
    fontSize: '14px',
  },
  sendBtn: {
    padding: '10px 20px',
    borderRadius: '20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
