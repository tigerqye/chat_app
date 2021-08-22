const sendButton = document.getElementById("publish");
const inputField = document.getElementById("input-field");
require('dotenv').config();

var ably = new Ably.Realtime(process.env.ABLY_KEY);
ably.connection.on('connected', function() {
  alert("That was simple, you're now connected to Ably in realtime");
});

var channel = ably.channels.get('quickstart');
channel.subscribe('greeting', function(message) {
  show(message.data);
});

//Add an event listener to check when the send button is clicked
sendButton.addEventListener('click', function() {
    const input = inputField.value;
    inputField.value = "";

    //send message
    channel.publish('greeting', input);
});  

//This method displays the message.
function show(text, messageType="receive") {
    const messageItem = `<li class="message ${messageType === "send" ? "sent-message": ""}">
        <div class="message-info"> 
            <p class="message-text">${text}</p>
        </div> 
    </li>`
    // const messageItem = `<li class="message">${text}<span class="message-time"> ${time}</span></li`;
    $('#channel-status').append(messageItem)
}