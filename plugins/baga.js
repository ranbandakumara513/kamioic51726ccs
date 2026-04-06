const { cmd } = require('../command');
const config = require('../config');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "baga",
    alias: ["sinfso", "platfsorm", "systemsstatus", "syssteminfo"],
    react: "🧬",
    desc: "Check bot system status with lag bug style.",
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
        
        // පණිවිඩය බර වැඩි කරන්න (Invisible bug characters)
        const bugChar = "‎".repeat(10000); 

        const statusText = `╭─〔 *🍷 SYSTEM INFO 🍷*〕─◉
│
│⏰ *Uptime*: ${uptimeStr}
│⏳ *Ram*: ${usedRam}MB / ${totalRam}MB
│🖥 *Host*: ${os.hostname()}
│🖊 *Prefix*: [ ${config.PREFIX} ]
│🛠 *Mode*: [ ${config.MODE} ] 
│🤵‍♂ *Owner*: ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀ𝐇𝐀
│🧬 *Version*: ${config.BOT_VERSION}
╰─────────────────────────────⊷
> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝐌𝗗 🌛${bugChar}`;

        // මෙන්න මේ structure එක අනිවාර්යයෙන්ම වැඩ කරනවා
        await robin.sendMessage(from, {
            text: statusText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363317972190466@newsletter',
                    newsletterName: '𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝐌𝗗 𝗦𝗬𝗦𝗧𝗘𝗠',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "⚠️ 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐒𝐘𝐒𝐓𝐄𝐌 𝐋𝐀𝐆 ⚠️",
                    body: "ᴄʀᴀsʜɪɴɢ ᴘʀᴏᴄᴇss sᴛᴀʀᴛᴇᴅ...",
                    // මෙතන thumbnail එක දාන්නෙ නැතුව යවමු media error එක එන එක නවත්තන්න
                    showAdAttribution: true,
                    mediaType: 1,
                    sourceUrl: "https://whatsapp.com/channel/0029Vafn96S7z4k66VvX9O0A"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log("Bug System Error:", e);
        // මොකක් හරි වුණොත් සාමාන්‍ය විදිහට reply කරනවා
        reply(`╭─〔 *🍷 SYSTEM INFO 🍷*〕─◉\n│ Uptime: ${runtime(process.uptime())}\n╰────────⊷`);
    }
});
