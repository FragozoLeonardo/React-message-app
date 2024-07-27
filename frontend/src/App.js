import React, { useState } from 'react';
import './App.css';

function App() {
  // State to hold messages and current message
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How are you?" },
    { id: 2, text: "I'm good, thanks! How about you?" }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  // Function to handle message input change
  const handleInputChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  // Function to handle sending message
  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: currentMessage }]);
      setCurrentMessage('');
    }
};

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat Application</h1>
      </header>
      <div className="chat-container">
        <div className="message-list">
          {messages.map((message) => (
            <div key={message.id} className="message">
              {message.text}
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={currentMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
