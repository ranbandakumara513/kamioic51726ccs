const { cmd } = require('../command');
const Jimp = require("jimp");

cmd({
    pattern: "fulldp3",
    alias: ["fullpp3", "setpp3"],
    desc: "Set full profile picture (HD)",
    category: "owner",
    react: "🖼️",
    filename: __filename
},

async (conn, mek, m, { quoted, reply, isCreator, mime }) => {
    try {

        // 🔒 Owner only
        if (!isCreator) return reply("⚠️ Only bot owner can use this command.");

        // 📸 Check image
        if (!quoted) return reply("🖼️ Reply to an image with *.fulldp*");
        if (!/image/.test(mime)) return reply("⚠️ Please reply to an image only.");

        // ⬇️ Download image buffer
        let media = await quoted.download();

        // 🧠 Jimp processing
        const image = await Jimp.read(media);

        let width = image.getWidth();
        let height = image.getHeight();

        // 🟩 Crop square (center)
        let size = Math.min(width, height);
        let x = (width - size) / 2;
        let y = (height - size) / 2;

        image.crop(x, y, size, size);

        // 📏 Resize to HD WhatsApp size
        const final = await image
            .scaleToFit(720, 720)
            .quality(100)
            .getBufferAsync(Jimp.MIME_JPEG);

        // 🚀 Set profile picture (modern Baileys method)
        await conn.updateProfilePicture(conn.user.id, final);

        reply("✅ *Full HD Profile Picture Updated!*");

    } catch (err) {
        console.error(err);
        reply("❌ Error updating profile picture!");
    }
});
