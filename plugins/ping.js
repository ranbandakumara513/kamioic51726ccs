const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "pong", "ranuspeed", "ranuping", "ranumithaspeed"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const startTime = Date.now();

        const emojis = ['💀', '⚡'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // React with random emoji
        await conn.sendMessage(from, {
            react: { text: randomEmoji, key: mek.key }
        });

        // First send: "ping ! ! !"
        let sentMsg = await conn.sendMessage(from, { text: "ping ! ! !" }, { quoted: mek });

        // Calculate ping
        const ping = Date.now() - startTime;

        // Edit same message with ping result
        const newText = `*Pong: _${ping}ms_ ${randomEmoji}*`;

        await conn.sendMessage(from, {
            edit: sentMsg.key,  // edit same message
            text: newText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: false,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: "",
                    serverMessageId: 143
                }
            }
        });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
})


// ping2 

// Fake ChatGPT vCard
// Fake vCard
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© Mr Hiruka",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Meta
ORG:META AI;
TEL;type=CELL;type=VOICE;waid=94762095304:+94762095304
END:VCARD`
        }
    }
};

cmd({
    pattern: "ping2",
    alias: ["speed2", "pong2", "ranuspeed2", "ranumithaspeed2"],
    use: '.ping2',
    desc: "Check bot's response time.",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const startTime = Date.now();

        const emojis = ['🔥', '⚡', '🚀', '🕐'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // React with random emoji
        await conn.sendMessage(from, {
            react: { text: randomEmoji, key: mek.key }
        });

        const ping = Date.now() - startTime;

        // Speed badge and color
        let badge = '🐢 Slow', color = '🔴';
        if (ping <= 150) {
            badge = '🚀 Super Fast';
            color = '🟢';
        } else if (ping <= 300) {
            badge = '⚡ Fast';
            color = '🟡';
        } else if (ping <= 600) {
            badge = '⚠️ Medium';
            color = '🟠';
        }

        // Final message
        const text = `*RANUMITHA-X-MD Pong: ${ping} ms ${randomEmoji}*\n> *sᴛᴀᴛᴜs: ${color} ${badge}*\n> *ᴠᴇʀsɪᴏɴ: ${config.BOT_VERSION}*`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: false,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: "",
                    serverMessageId: 143
                }
            }
        }, { quoted: fakevCard });

    } catch (e) {
        console.error("❌ Error in ping2 command:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
