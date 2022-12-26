// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Sets up OpenAI API with credentials
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// On message event, take input as prompt and generate response
client.on("messageCreate", function (message) {
  if (message.author.bot) return;
  let prompt = message.content;
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
