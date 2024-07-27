const http = require('http');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Utility functions
const readJSONFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeJSONFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// File paths
const usersPath = path.join(__dirname, 'data', 'users.json');
const messagesPath = path.join(__dirname, 'data', 'messages.json');
const conversationsPath = path.join(__dirname, 'data', 'conversations.json');

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (req.url === '/signup' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { username, email, password } = JSON.parse(body);
      const users = readJSONFile(usersPath);
      const newUser = { id: uuidv4(), username, email, password, profilePicture: '', status: '' };
      users.push(newUser);
      writeJSONFile(usersPath, users);
      res.writeHead(201, headers);
      res.end(JSON.stringify({ message: 'User created' }));
    });
  } else if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { email, password } = JSON.parse(body);
      const users = readJSONFile(usersPath);
      const user = users.find(user => user.email === email && user.password === password);
      if (user) {
        res.writeHead(200, headers);
        res.end(JSON.stringify({ token: user.id }));
      } else {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }
    });
  } else if (req.url.startsWith('/profile') && req.method === 'GET') {
    const userId = req.url.split('/')[2];
    const users = readJSONFile(usersPath);
    const user = users.find(user => user.id === userId);
    if (user) {
      res.writeHead(200, headers);
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else if (req.url.startsWith('/profile') && req.method === 'PUT') {
    const userId = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { username, profilePicture, status } = JSON.parse(body);
      const users = readJSONFile(usersPath);
      const user = users.find(user => user.id === userId);
      if (user) {
        user.username = username || user.username;
        user.profilePicture = profilePicture || user.profilePicture;
        user.status = status || user.status;
        writeJSONFile(usersPath, users);
        res.writeHead(200, headers);
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, headers);
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    });
  } else if (req.url.startsWith('/messages') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { senderId, receiverId, content, image } = JSON.parse(body);
      const messages = readJSONFile(messagesPath);
      const newMessage = { id: uuidv4(), senderId, receiverId, content, timestamp: new Date(), image: image || '' };
      messages.push(newMessage);
      writeJSONFile(messagesPath, messages);
      res.writeHead(201, headers);
      res.end(JSON.stringify(newMessage));
    });
  } else if (req.url.startsWith('/messages') && req.method === 'GET') {
    const [_, senderId, receiverId] = req.url.split('/');
    const messages = readJSONFile(messagesPath);
    const conversation = messages.filter(msg =>
      (msg.senderId === senderId && msg.receiverId === receiverId) ||
      (msg.senderId === receiverId && msg.receiverId === senderId)
    );
    res.writeHead(200, headers);
    res.end(JSON.stringify(conversation));
  } else {
    res.writeHead(404, headers);
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
