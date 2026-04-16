const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");
const { getContentType } = require("@whiskeysockets/baileys");

// save folder
const SAVE_DIR = path.join(__dirname, "../saved_messages");

// create folder if not exists
if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR, { recursive: true });
}

// extract message using getContentType
function extractMessage(message) {
    if (!message) return null;

    const type = getContentType(message);
    if (!type) return null;

    let content = message[type];

    // viewOnce support (basic unwrap)
    if (type === "viewOnceMessage" || type === "viewOnceMessageV2") {
        content = content.message;
        const innerType = getContentType(content);
        if (innerType) {
            return content[innerType];
        }
    }

    return content;
}

cmd({
    pattern: "svx",
    desc: "Save message using getContentType",
    category: "tools",
    react: "💾",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    try {

        const extracted = extractMessage(mek.message);

        if (!extracted) {
            return reply("❌ Message not found / unsupported type");
        }

        // file name
        const fileName = `${Date.now()}_${mek.key.id}.json`;
        const filePath = path.join(SAVE_DIR, fileName);

        // save full structured data
        const saveData = {
            type: getContentType(mek.message),
            message: extracted,
            from: mek.key.remoteJid,
            sender: mek.key.participant || mek.key.remoteJid,
            timestamp: Date.now()
        };

        fs.writeFileSync(filePath, JSON.stringify(saveData, null, 2));

        reply(`✅ Saved Successfully!\n📁 ${fileName}`);

    } catch (err) {
        console.log("SVX ERROR:", err);
        reply("❌ Save failed");
    }
});
