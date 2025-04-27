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
const token = process.env.DISCORD_TOKEN;
client.login(token);
