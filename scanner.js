(async () => {
  const recursionLimit = 3;
  const maxMembersPerGroup = 200;

  const flaggedKeywords = ["ace", "bull", "bunny", "snowbunny", "spade"];

  const flaggedGroupIds = [
    "35114972", "35396105", "35736468", "35378900", "8570423", "33849843", "13764554", "1018746",
    "35266676", "35901172", "33455456", "33508385", "35515903", "7953154", "35724916", "13854211",
    "35597092", "35256383", "11166218", "7295081", "35767526", "34152807", "35487329", "35328440",
    "35241326", "4627396", "35522372", "35179038", "35522866", "35525497", "35546099", "34832659",
    "33926206", "35767497", "34549346", "35690030", "35551735", "35193738", "35829943", "35109517",
    "35355952", "35343368", "13152753", "16230170", "35571745", "35739371", "35749620", "35759845",
    "32608979", "34408471", "34749564", "35747984", "35357638", "33862650", "3451166","35357464", "35477121", "33904411", "35162289", "35306237", "33099452", "3331780", "5038898", "34903652", "4928849", "35130291", "16772560", "7424914", "34673231", "34816688", "32688819", "34616910", "13155003", "9593321"
  ];

  const suspiciousGroups = [];
  const flaggedGroups = [];

  const knownUsers = new Set();
  const visitedGroups = new Set();
  const visitedUsers = new Set();

  async function fetchUserGroups(userId) {
    try {
      const response = await fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
      const data = await response.json();
      return (data.data || []).map(group => ({ id: group.group.id, name: group.group.name }));
    } catch {
      return [];
    }
  }

  async function fetchGroupMembers(groupId) {
    let members = [];
    let cursor = "";
    try {
      while (members.length < maxMembersPerGroup) {
        const response = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/users?limit=100&sortOrder=Asc${cursor ? `&cursor=${cursor}` : ""}`);
        const data = await response.json();
        if (!data.data) break;
        members = members.concat(data.data.map(u => u.userId));
        if (!data.nextPageCursor) break;
        cursor = data.nextPageCursor;
      }
    } catch {
      // ignore errors
    }
    return members.slice(0, maxMembersPerGroup);
  }

  function containsKeyword(text) {
    text = text.toLowerCase();
    return flaggedKeywords.some(keyword => text.includes(keyword));
  }async function scanGroup(groupId, depth) {
    if (depth > recursionLimit || visitedGroups.has(groupId)) return;
    visitedGroups.add(groupId);

    let groupName = "";
    try {
      const response = await fetch(`https://groups.roblox.com/v1/groups/${groupId}`);
      const data = await response.json();
      groupName = data.name || "";
    } catch {
      groupName = "";
    }

    const members = await fetchGroupMembers(groupId);
    if (members.length === 0) return;

    let overlap = members.filter(u => knownUsers.has(u));
    const keywordHit = containsKeyword(groupName);
    const groupIdMatch = flaggedGroupIds.includes(groupId.toString());

    if (overlap.length >= 2 || keywordHit || groupIdMatch) {
      const groupInfo = {
        id: groupId,
        name: groupName,
        link: `https://www.roblox.com/groups/${groupId}`,
        overlap: overlap.length,
        direct: depth === 0
      };

      if (keywordHit || groupIdMatch) {
        flaggedGroups.push(groupInfo);
      } else {
        suspiciousGroups.push(groupInfo);
      }

      for (const userId of members) {
        if (!visitedUsers.has(userId)) {
          visitedUsers.add(userId);
          const userGroups = await fetchUserGroups(userId);
          for (const group of userGroups) {
            await scanGroup(group.id, depth + 1);
          }
        }
      }
    }

    members.forEach(u => knownUsers.add(u));
  }

  async function scanUsers(userIds) {
    for (const userId of userIds) {
      knownUsers.add(userId);
      visitedUsers.add(userId);

      const groups = await fetchUserGroups(userId);
      for (const group of groups) {
        await scanGroup(group.id, 0);
      }
    }

    console.log("\n=== FLAGGED GROUPS (User's own groups) ===");
    const directFlagged = flaggedGroups.filter(g => g.direct);
    if (directFlagged.length > 0) {
      directFlagged.forEach(group => {
        console.log(`[FLAGGED] ID: ${group.id} | Name: ${group.name} | Link: ${group.link}`);
      });
    } else {
      console.log("None.");
    }

    console.log("\n=== FLAGGED GROUPS (Found during scan) ===");
    const foundFlagged = flaggedGroups.filter(g => !g.direct);
    if (foundFlagged.length > 0) {
      foundFlagged.forEach(group => {
        console.log(`[FLAGGED FOUND] ID: ${group.id} | Name: ${group.name} | Link: ${group.link}`);
      });
    } else {
      console.log("None.");
    }

    console.log("\n=== SUSPICIOUS GROUPS (User's own groups) ===");
    const directSuspicious = suspiciousGroups.filter(g => g.direct);
    if (directSuspicious.length > 0) {
      directSuspicious.forEach(group => {
        console.log(`[SUS] ID: ${group.id} | Name: ${group.name} | Overlaps: ${group.overlap} | Link: ${group.link}`);
      });
    } else {
      console.log("None.");
    }

    console.log("\n=== SUSPICIOUS GROUPS (Found during scan) ===");
    const foundSuspicious = suspiciousGroups.filter(g => !g.direct);
    if (foundSuspicious.length > 0) {
      foundSuspicious.forEach(group => {
        console.log(`[SUS FOUND] ID: ${group.id} | Name: ${group.name} | Overlaps: ${group.overlap} | Link: ${group.link}`);
      });
    } else {
      console.log("None.");
    }
  }

  // Start scanning
  await scanUsers([userIds]);
})();

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
module.exports = scanUsers;
