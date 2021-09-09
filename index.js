const sendButton = document.getElementById("publish");
const inputField = document.getElementById("input-field");
const join = document.getElementById("join-channel");
const nameField = document.getElementById("name");
const channelCode = document.getElementById("channel-field");
const chat = document.getElementById("chat");
const connection = document.getElementById("connection");
var username;
var code;
require('dotenv').config();

var ably = new Ably.Realtime({ key : process.env.ABLY_KEY, echoMessages : false });

var channel = ably.channels.get('default');
channel.subscribe('message', function(message) {
  show(message.data.message, message.data.name);
});

class message_data {
    constructor(name, message) {
        this.name = name;
        this.message = message;
    }
}

//Add an event listener to check when the send button is clicked
var sendMessage = function () {
    let input = new message_data(username, inputField.value);
    inputField.value = "";
    if(input.message.replace(/\s/g, '') != "")
    {
        show(input.message, input.name, 'send');

        //send message
        channel.publish('message', input);
    } 
};

sendButton.addEventListener('click', sendMessage);  
inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
});

join.addEventListener('click', function() {
    username = nameField.value;
    code = channelCode.value;
    console.log(code);
    if(code.replace(/\s/g, '') != "" && username.replace(/\s/g, '') != "")
    {
        channel.unsubscribe();
        channel = ably.channels.get(code);
        channel.subscribe('message', function(message) {
            show(message.data.message, message.data.name);
        });
        chat.style.display = "initial";
        connection.innerHTML = "Connected to: " + code;
        const messageItem = `<div class="message-connection">Channel: ${code}</div>`
        // const messageItem = `<li class="message">${text}<span class="message-time"> ${time}</span></li`;
        $('#channel-status').append(messageItem);
        var lastMessage = document.querySelectorAll(".message-connection:last-child");
        lastMessage[0].scrollIntoView();
    }
    else {
        alert("Please Fill In The Values");
    }
});

//This method displays the message.
function show(text, sender, messageType='receive') {
    const messageItem = `<div class="message-name">${sender}</div>
    <li class="message ${messageType === "send" ? "sent-message": "recieved-message"}">
        <div class="message-info"> 
            <p class="message-text">${text}</p>
        </div> 
    </li>`
    // const messageItem = `<li class="message">${text}<span class="message-time"> ${time}</span></li`;
    $('#channel-status').append(messageItem);
    var lastMessage = document.querySelectorAll(".message:last-child");
    lastMessage[0].scrollIntoView();
}