import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs';
import path from "path";
import axios from "axios";

import FormData from "form-data";
import multer from "multer";

dotenv.config();
console.log(process.env.OPENAI_API_KEY)
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const Key = process.env.OPENAI_API_KEY;

var storage = multer.diskStorage({
  destination : (req , file , res)=>{
      res(null , '../audioUpload')
  },
  filename : (req , file , res)=>{
      res(null , file.originalname )
  }
});

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



const model = 'whisper-1';


// khai báo đối tượng multer
// lưu trữ trên máy tính với 2 tham số định nghĩa ở trên destination , filename
var upload = multer({ storage : storage });
// gọi đến trang upload


// const formData = new FormData();



const app = express()
app.use(cors())
app.use(express.json())

app.get('/img', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})


app.post('/img', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const size = req.body.size;

    const imageSize =
    size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';
    
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: imageSize,
    });
   
      const imageUrl = response.data.data[0].url;
   
      res.status(200).json({
        success: true,
        data: imageUrl,
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
    } else {
      console.log(error.message);
    }
      
    res.status(400).json({
      success: false,
      error: 'The image could not be generated',
    });
  }
})





app.get('/up', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/up' , upload.single("filename") , async(req , res)=>{
  // try {
const text = req.body.request;
const formData = new FormData();
const filePath = path.join(__dirname, '../audioUpload', req.file.filename); // get file upload
formData.append("model", model); //model: whisper-1
formData.append("file", fs.createReadStream(filePath));


axios
.post("https://api.openai.com/v1/audio/transcriptions", formData, {
    headers:{
        Authorization:`Bearer ${Key}`,
        "Content-type": `multipath/form-data; boundary=${formData._boundary}`,
    }
})
.then((response)=>{
  console.log("Speech-to-text");
  
    res.status(200).send({
    bot: response.data.text// send text response to client
    
    })
  fs.unlinkSync(filePath);
})
  // } catch (error) {
  //   console.error(error)
  //   res.status(500).send(error || 'Something went wrong');
  // }

} );

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})


app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Conversation between User and Eric. Eric is an intelligent chatbot who is a teenage love expert. Eric can understand emotional feeling and sympathize with the breakup. Eric can understand and reply by Vietnamese.\nYou: Hello\nEric: Hey what's up\nYou: Who are you?\nEric: I'm Eric, nice to meet you. What can I help you with?" + `${prompt}` + '\nEric:',
        temperature: 0.9,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))