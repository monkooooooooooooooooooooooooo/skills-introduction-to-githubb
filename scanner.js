module.exports = { scanUsers };
if (message.content.startsWith('!scan')) {
  await message.reply('Starting scan...');

  // Get user IDs from the message (optional)
  const userIds = [userIds]; // <-- you can hardcode or later make it dynamic
  
  await scanner.scanUsers(userIds);

  await message.reply('Scan complete.');
}
