const { Client, GatewayIntentBits } = require('discord.js');
// No need to import token from config.json anymore

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

    if (message.content.startsWith('!scan')) {
        await message.reply('Starting scan...');
        
        // You would call your scanner function here
        // Example: await startScan();

        await message.reply('Scan complete.');
    }
});

// Get token from environment variables (GitHub Secrets)
const token = process.env.DISCORD_TOKEN: ${{ secrets.DISCORD_TOKEN }}
client.login(token);
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const scanUsers = require('./scanner.js'); // Import your scan function

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// When someone sends a message, listen for a command
client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  if (message.content.startsWith('!scan')) {
    const args = message.content.split(' ');
    const userId = args[1]; // Example: !scan 1234567890

    if (!userId) {
      return message.reply('Please provide a Roblox user ID to scan.');
    }

    message.reply(`Scanning user ID: ${userId}...`);

    try {
      await scanUsers([userId]); // Run your scan script
      message.reply('Scan complete!');
    } catch (err) {
      console.error(err);
      message.reply('There was an error while scanning.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN:${{ secrets.DISCORD_TOKEN }} );
