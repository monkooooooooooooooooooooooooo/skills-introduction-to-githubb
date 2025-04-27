// Assuming `scanner` is required elsewhere, just ensure it's loaded here
const scanner = require('./scanner.js'); 

module.exports = { scanUsers };

if (message.content.startsWith('!scan')) {
  await message.reply('Starting scan...');

  // Get user IDs from the message (optional)
  const userIds = [userIds]; // <-- you can hardcode or make it dynamic later
  
  // Make sure `scanner.scanUsers` is called properly with user IDs
  await scanner.scanUsers(userIds);

  await message.reply('Scan complete.');
}
