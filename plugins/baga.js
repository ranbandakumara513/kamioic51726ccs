const { cmd } = require('../command');
const config = require('../config');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "system",
    alias: ["sinfo", "platform", "systemstatus", "systeminfo"],
    react: "🧬",
    desc: "Check bot system status.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, {
    from, quoted, reply, sender
}) => {
    try {
        const uptimeStr = runtime(process.uptime());
        const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
        
        const statusText = `╭─〔 *🍷 SYSTEM INFO 🍷*〕─◉
│
│⏰ *Uptime*: ${uptimeStr}
│⏳ *Ram*: ${usedRam}MB / ${totalRam}MB
│🖥 *Host*: ${os.hostname()}
│🖊 *Prefix*: [ ${config.PREFIX} ]
│🛠 *Mode*: [ ${config.MODE} ] 
│🤵‍♂ *Owner*: ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀＨ𝐀
│🧬 *Version*: ${config.BOT_VERSION}
╰─────────────────────────────⊷
> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // Invalid Media Type error එක මඟහරවා ගැනීමට ලස්සන External Ad Reply එකක් භාවිතා කර ඇත
        await robin.sendMessage(from, {
            text: statusText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363317972190466@newsletter',
                    newsletterName: '𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦",
                    body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜᴋᴀ ʀᴀɴᴜᴍɪᴛʜᴀ",
                    thumbnailUrl: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/System%20%20info.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vafn96S7z4k66VvX9O0A", // ඔබේ චැනල් ලින්ක් එක දෙන්න
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log("System Error:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
