var heartClicked = false;
var voiceInput = false;
var fileInput = false;

var userText ='';
var WhisperText ='';
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

const synth = window.speechSynthesis;



function TextToSpeak(text)
{
  let utterText = new SpeechSynthesisUtterance(text);
  utterText.lang = "vi-VN";
  synth.speak(utterText);
}

var generate_prompt = "";
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
  userText = $("#textInput").val();
  var userHtml = '';
  if(fileInput == true)
  {
    fileInput == false;
    userText = WhisperText
  }
  else if(voiceInput == true)
  {
    userText = SpeechText;
    voiceInput = false;
  }
  
  else if (userText == "" && heartClicked == false && voiceInput == false && fileInput == false) {
    userText = "Hello";
  }
  
  if(heartClicked == false)
    userHtml = '<p class="userText"><span>' + userText + '</span></p>';
  else if(heartClicked == true)
  {
      heartClicked = false;
      userText = 'I Love You';
  }

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  console.log(userText);
  generate_prompt = generate_prompt + '\nYou' + userText;
  document.getElementById("chat-bar-bottom").scrollIntoView(true);
  const textResponse = await fetch('http://localhost:5000', {
    method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: generate_prompt
        })
  });
  
  
  // const data2 = await response.json();
  // const botResponse = data2.bot.trim();
  // console.log(data2);
  const data = await textResponse.json();
  const botResponse = data.bot.trim() // trims any trailing spaces/'\n' 
  generate_prompt = generate_prompt + '\nEric: ' + botResponse;
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

}



function sendButton() {
  getResponse();
}

function heartButton() {
  heartClicked = true;
  buttonSendText('<i style="color: crimson;" class="fa fa-fw fa-heart"></i>');
  getResponse("I Love You");
}


var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.continuous = false;

const microphone = document.querySelector('.microphone');

microphone.addEventListener('click', (e) => {
  e.preventDefault();

  recognition.start();
  microphone.classList.add('recording');

});

recognition.onspeechend = () => {
  recognition.stop();
  microphone.classList.remove('recording');
}

recognition.onerror = (err) => {
  console.error(err);
  microphone.classList.remove('recording');
}

recognition.onresult = (e) => {
  console.log('onresult', e);
  SpeechText = e.results[0][0].transcript;
  voiceInput = true;
  getResponse(e);
}


  var f = document.querySelector("#fileForm");
  var btn = document.querySelector(".aufile");
  btn.addEventListener("click", (e)=>{
    if(f.style.display=="inline-block"){
      f.style.display="none";

      btn.style.position = "relative";
      btn.style.zIndex = "0";
      btn.style.right = "0";
      btn.style.color = "black";
    }
    else{
      f.style.display="inline-block";

    btn.style.position = "absolute";
    btn.style.zIndex = "11";
    btn.style.right = "0";
    btn.style.color = "red";
    }
  });
  

 


function submitForm(e, form){
  e.preventDefault();
  form.style.display = "none";
  btn.style.position = "relative";
  btn.style.zIndex = "0";
  btn.style.right = "0";
  btn.style.color = "black";
  fetch('http://localhost:5000/up', {
    method: 'post',
    body: new FormData(form)
  }).then(function(response) {
    return response.json();
    // fileInput = true;
    // getResponse();
  }).then((user)=>{
    
    WhisperText = user.bot;
    fileInput = true;
    getResponse();
  });
}


//Main//
firstBotMessage();
// Press enter to send a message
$("#textInput").keypress(function (e) {
  if (e.which == 13) {
      getResponse(e);
  }
});

