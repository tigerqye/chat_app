const sendButton = document.getElementById("publish");
const inputField = document.getElementById("input-field");
const join = document.getElementById("join-channel");
const nameField = document.getElementById("name");
const channelCode = document.getElementById("channel-field");
const chat = document.getElementById("chat");
var username;
var code;
var lastChannel = 'default';
require('dotenv').config();

var ably = new Ably.Realtime({ key : process.env.ABLY_KEY, echoMessages : false });

var channel = ably.channels.get('default');
channel.subscribe('greeting', function(message) {
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
    if(input != "")
    {
        show(input.message, input.name, 'send');

        //send message
        channel.publish('greeting', input);
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
        if(code != "default" && lastChannel != code)
        {
            channel.unsubscribe(lastChannel);
            channel = ably.channels.get(code);
            channel.subscribe('greeting', function(message) {
                show(message.data.message, message.data.name);
            });
            lastChannel = code;
        }
        chat.style.display = "initial";
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
    $('#channel-status').append(messageItem)
}