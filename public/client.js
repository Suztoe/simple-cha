const socket = io();
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

let userId = Math.random().toString(36).substr(2, 9);

socket.on('connect', () => {
    console.log('Connected to server');
    addSystemMessage('チャットに接続しました');
});

socket.on('message', (data) => {
    addMessage(data.text, data.userId === userId, data.time);
});

socket.on('userJoined', (data) => {
    addSystemMessage(`${data.count}人がオンライン`);
});

socket.on('userLeft', (data) => {
    addSystemMessage(`${data.count}人がオンライン`);
});

function addMessage(text, isOwn, time) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    messageDiv.appendChild(textSpan);
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'time';
    timeDiv.textContent = time;
    messageDiv.appendChild(timeDiv);
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        const time = new Date().toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        socket.emit('message', {
            text: text,
            userId: userId,
            time: time
        });
        
        messageInput.value = '';
        messageInput.focus();
    }
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

messageInput.addEventListener('input', () => {
    sendButton.disabled = messageInput.value.trim() === '';
});

sendButton.disabled = true;
messageInput.focus();
