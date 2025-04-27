const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json'); // loads token safely from config.json

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === "!ping") {
        await message.reply("Pong!");
    }
});

client.login(config.token);
