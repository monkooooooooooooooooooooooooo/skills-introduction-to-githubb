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
const scanUsers = require('./scanner.js'); // Your scanner script

const token = process.env.DISCORD_TOKEN; // GitHub Actions / GitHub Secrets injects this

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!scan')) {
    const args = message.content.split(' ');
    const userId = args[1];

    if (!userId) {
      return message.reply('Please provide a Roblox user ID to scan.');
    }

    message.reply(`Scanning user ID: ${userId}...`);

    try {
      await scanUsers([userId]);
      message.reply('Scan complete!');
    } catch (err) {
      console.error(err);
      message.reply('Error occurred during scanning.');
    }
  }
});

if (!token) {
  console.error('DISCORD_TOKEN is not set! Did you configure GitHub Secrets correctly?');
  process.exit(1);
}

client.login(token);
