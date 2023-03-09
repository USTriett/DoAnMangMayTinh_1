
function getTime() {
  let today = new Date();
  hours = today.getHours();
  minutes = today.getMinutes();

  if (hours < 10) {
      hours = "0" + hours;
  }

  if (minutes < 10) {
      minutes = "0" + minutes;
  }

  let time = hours + ":" + minutes;
  return time;
}

console.log(getTime());

// Gets the first message


const checkBrowserCompatibility = () => {
  if('speechSynthesis' in window){
    console.log("Web Speech API supported!")
  } else {
    console.log("Web Speech API not supported :-(")   
  }
}

'speechSynthesis' in window ? console.log("Web Speech API supported!") : console.log("Web Speech API not supported :-(")

const synth = window.speechSynthesis



function TextToSpeak(text)
{
  let utterText = new SpeechSynthesisUtterance(text);
  synth.speak(utterText);
}


function firstBotMessage() {
  let firstMessage = "How's it going?"
  document.getElementById("botStarterMessage").innerHTML = '<p class="botText"><span>' + firstMessage + '</span></p>';
  TextToSpeak(firstMessage);
  let time = getTime();

  $("#chat-timestamp").append(time);
  document.getElementById("userInput").scrollIntoView(false);
}
//Gets the text text from the input box and processes it
const getResponse = async(e) => {
  let userText = $("#textInput").val();

  if (userText == "") {
      userText = "Hello";
  }

  let userHtml = '<p class="userText"><span>' + userText + '</span></p>';

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  console.log(userText);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);
  const response = await fetch('http://localhost:5000', {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      prompt: userText
    })
  });
  const data2 = await response.json();
  const botResponse = data2.bot.trim();
  console.log(data2);
  let botHtml = '<p class="botText"><span>' + botResponse + '</span></p>';
  checkBrowserCompatibility();
  $("#chatbox").append(botHtml);
  TextToSpeak(botResponse);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);

}

// Handles sending text via button clicks
function buttonSendText(sampleText) {
  let userHtml = '<p class="userText"><span>' + sampleText + '</span></p>';

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  
  document.getElementById("chat-bar-bottom").scrollIntoView(true);

  //Uncomment this if you want the bot to respond to this buttonSendText event
  // setTimeout(() => {
  //     getHardResponse(sampleText);
  // }, 1000)
}

function sendButton() {
  getResponse();
}

function heartButton() {
  buttonSendText("Heart clicked!")
}


firstBotMessage();

// Press enter to send a message
$("#textInput").keypress(function (e) {
  if (e.which == 13) {
      getResponse(e);
  }
});