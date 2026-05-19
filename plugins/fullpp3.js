const { cmd } = require('../command');
const Jimp = require("jimp");

cmd({
    pattern: "fulldp3",
    alias: ["fullpp3", "setpp3"],
    desc: "Set full profile picture",
    category: "owner",
    react: "🖼️",
    filename: __filename
},

async (conn, mek, m, { quoted, reply, isCreator }) => {
    try {

        if (!isCreator) {
            return reply("⚠️ Only bot owner can use this command.");
        }

        if (!quoted) {
            return reply("🖼️ Reply to an image with *.fulldp*");
        }

        // 🔓 Extract real message (handle view once / ephemeral)
        let qmsg = quoted.message || quoted;
        
        if (qmsg?.ephemeralMessage) {
            qmsg = qmsg.ephemeralMessage.message;
        }

        if (qmsg?.viewOnceMessage) {
            qmsg = qmsg.viewOnceMessage.message;
        }

        // 🔍 Find image inside
        let isImage = qmsg.imageMessage ? true : false;

        if (!isImage) {
            return reply("⚠️ Please reply to an image only.");
        }

        // ⬇️ Download image (this works for all)
        let buffer = await quoted.download();

        // 🧠 Jimp processing
        const image = await Jimp.read(buffer);

        let w = image.getWidth();
        let h = image.getHeight();

        let size = Math.min(w, h);
        let x = (w - size) / 2;
        let y = (h - size) / 2;

        image.crop(x, y, size, size);

        const final = await image
            .scaleToFit(720, 720)
            .quality(100)
            .getBufferAsync(Jimp.MIME_JPEG);

        // 🚀 Set DP
        await conn.updateProfilePicture(conn.user.id, final);

        return reply("✅ Full HD Profile Picture Updated!");

    } catch (e) {
        console.log(e);
        return reply("❌ Error updating profile picture!");
    }
});
