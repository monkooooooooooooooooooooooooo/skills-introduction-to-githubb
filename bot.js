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
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json'); // your token stays local

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// BASIC COMMAND HANDLER
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    await message.reply('Pong!');
  }

  if (message.content.startsWith('!scan')) {
    await message.reply('Starting scan...');

    // You would call your scanner function here
    // Example: await startScan();

    await message.reply('Scan complete.');
  }
});

client.login(token);
const scanner = require('./scanner.js');
