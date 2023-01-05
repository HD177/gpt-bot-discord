// Require the necessary discord.js, openai, and dotenv modules
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
// 'c' is used for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Sets up OpenAI API with credentials
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let responseLength = 250; //TODO make this configurable at some point

// On message event, take input as prompt and generate response
client.on("messageCreate", function (message) {
    if (message.channel.name !== 'gpt-gen') {
    return;
    } else {
        if (message.author.id === client.user.id) {
        return;
    } else {
        // Send request to OpenAI API
        const prompt = message.content;
        console.log(prompt + '-given');
        (async () => {
            const gptResponse = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: responseLength,
                temperature: 0.3,
                //  top_p: 0.3,
                presence_penalty: 0,
                frequency_penalty: 0.5,
            });
            console.log(gptResponse.data.choices[0].text);
            message.reply(`${gptResponse.data.choices[0].text}`);
        })();
    }
    }
});

client.login(process.env.token);