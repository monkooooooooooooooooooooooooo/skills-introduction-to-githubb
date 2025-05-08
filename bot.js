const { Client, GatewayIntentBits } = require('discord.js');
const scanUsers = require('./scanner.js'); // Make sure this file exists

const token = process.env.DISCORD_TOKEN; // Make sure this is set in Render or GitHub Secrets

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

  if (message.content === '!ping') {
    await message.reply('Pong!');
  }
});

if (!token) {
  console.error('DISCORD_TOKEN is not set!');
  process.exit(1);
}

client.login(token);
