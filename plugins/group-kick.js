const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove", "k"],
    desc: "Removes a user from the group by reply or mention",
    category: "admin",
    react: "🦶",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmins, isOwner, reply }) => {
    try {
        if (!isGroup) return reply("📛 *Group command only!*");
        if (!isOwner) return reply("📛 *Owner only command!*");

        let mentionedJid;

        // Mentioned
        if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            mentionedJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Reply
        else if (mek.message?.extendedTextMessage?.contextInfo?.participant) {
            mentionedJid = mek.message.extendedTextMessage.contextInfo.participant;
        } else {
            return reply("⚠️ *Reply to a user's message or mention them to kick!*"); 
        }

        // Bot detect
        const botJid = conn.user.id?.split(":")[0] + "@s.whatsapp.net";
        if (mentionedJid === botJid) {
            return reply("😒 *It's me!*");
        }

        await conn.groupParticipantsUpdate(from, [mentionedJid], "remove");

        await conn.sendMessage(from, { 
            text: `✅ *Successfully Removed:* @${mentionedJid.split("@")[0]}`,
            mentions: [mentionedJid]
        });

    } catch (err) {
        console.log(err);
        reply("❌ *Failed to remove the user!*");
    }
});
