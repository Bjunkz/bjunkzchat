const socket = io()
const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.querySelector('#room-name')
const userlist = document.querySelector('#users')

//get username and ROOM from URL

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('joinRoom', { username, room })

let input = document.querySelector("#input");

chatForm.addEventListener('submit', function(e){
  e.preventDefault()

  const msg = e.target.elements.msg.value; 

    //emit message to server
  socket.emit('chatMessage', msg)

  //clear input
  e.target.elements.msg.value = ""
  e.target.elements.msg.focus()
});

socket.on("message", function(msg){
  console.log(msg);
  outputMessage(msg)
  chatMessages.scrollTop = chatMessages.scrollHeight;

})

//output to DOM
function outputMessage(msg){
    const div = document.createElement("div")
    div.classList.add("message")
    div.innerHTML=`<p class="meta">${msg.username}<span>${msg.time}</span></p>
    <p class="text">
    ${msg.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div)
}

//get room and users

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

function outputRoomName (room){
    roomName.innerText = room;
}

//add users to DOM

function outputUsers(users){
 userlist.innerHTML = `
 ${users.map(user => `<li>${user.username}</li>`).join("")}
 `
}