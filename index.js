// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// The fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
// The path module is Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
// The Collection class extends JavaScript's native Map class, and includes more extensive, useful functionality. Collection is used to store and efficiently retrieve commands for execution.

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });


const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let prompt = `This is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\n`;

client.on("messageCreate", function (message) {
  if (message.author.bot) return;
  prompt += `You: ${message.content}\n`;
 (async () => {
       const gptResponse = await openai.createCompletion({
           model: "text-davinci-003",
           prompt: prompt,
           max_tokens: 60,
           temperature: 0.3,
          //  top_p: 0.3,
           presence_penalty: 0,
           frequency_penalty: 0.5,
         });
       message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
       prompt += `${gptResponse.data.choices[0].text}\n`;
   })();
});
