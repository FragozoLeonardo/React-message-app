import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
    } else {
      fetch(`http://localhost:5000/profile/${token}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => history.push('/login'));
    }
  }, [history]);

  return (
    <div>
      {user ? (
        <div className="chat-container">
          <ChatSidebar user={user} />
          <ChatWindow user={user} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Chat;
