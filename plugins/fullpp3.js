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

        if (!isCreator) return reply("⚠️ Only bot owner can use this command.");
        if (!quoted) return reply("🖼️ Reply to an image with *.fulldp*");

        // 📸 get buffer
        let buffer = await quoted.download();

        if (!buffer) return reply("⚠️ Failed to download image!");

        // 🧠 process image
        const image = await Jimp.read(buffer);

        let w = image.getWidth();
        let h = image.getHeight();

        let size = Math.min(w, h);
        let x = (w - size) / 2;
        let y = (h - size) / 2;

        image.crop(x, y, size, size);

        const final = await image
            .resize(720, 720)
            .quality(100)
            .getBufferAsync(Jimp.MIME_JPEG);

        // 🚀 SET PROFILE PICTURE (REAL BAILEYS METHOD)
        await conn.query({
            tag: "iq",
            attrs: {
                to: "s.whatsapp.net",
                type: "set",
                xmlns: "w:profile:picture"
            },
            content: [
                {
                    tag: "picture",
                    attrs: { type: "image" },
                    content: final
                }
            ]
        });

        return reply("✅ Full HD Profile Picture Updated!");

    } catch (e) {
        console.log(e);
        return reply("❌ Error updating profile picture!");
    }
});
