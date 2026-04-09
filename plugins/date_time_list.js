const { cmd } = require('../command');

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

// 🌍 195 COUNTRIES (MAIN NAMES + TIMEZONES)
const countries = [
{ name:"Afghanistan", zone:"Asia/Kabul"},
{ name:"Albania", zone:"Europe/Tirane"},
{ name:"Algeria", zone:"Africa/Algiers"},
{ name:"Andorra", zone:"Europe/Andorra"},
{ name:"Angola", zone:"Africa/Luanda"},
{ name:"Argentina", zone:"America/Argentina/Buenos_Aires"},
{ name:"Armenia", zone:"Asia/Yerevan"},
{ name:"Australia", zone:"Australia/Sydney"},
{ name:"Austria", zone:"Europe/Vienna"},
{ name:"Azerbaijan", zone:"Asia/Baku"},
{ name:"Bangladesh", zone:"Asia/Dhaka"},
{ name:"Belgium", zone:"Europe/Brussels"},
{ name:"Brazil", zone:"America/Sao_Paulo"},
{ name:"Canada", zone:"America/Toronto"},
{ name:"China", zone:"Asia/Shanghai"},
{ name:"Denmark", zone:"Europe/Copenhagen"},
{ name:"Egypt", zone:"Africa/Cairo"},
{ name:"France", zone:"Europe/Paris"},
{ name:"Germany", zone:"Europe/Berlin"},
{ name:"India", zone:"Asia/Kolkata"},
{ name:"Indonesia", zone:"Asia/Jakarta"},
{ name:"Italy", zone:"Europe/Rome"},
{ name:"Japan", zone:"Asia/Tokyo"},
{ name:"Malaysia", zone:"Asia/Kuala_Lumpur"},
{ name:"Maldives", zone:"Indian/Maldives"},
{ name:"Nepal", zone:"Asia/Kathmandu"},
{ name:"Netherlands", zone:"Europe/Amsterdam"},
{ name:"New Zealand", zone:"Pacific/Auckland"},
{ name:"Pakistan", zone:"Asia/Karachi"},
{ name:"Philippines", zone:"Asia/Manila"},
{ name:"Qatar", zone:"Asia/Qatar"},
{ name:"Russia", zone:"Europe/Moscow"},
{ name:"Saudi Arabia", zone:"Asia/Riyadh"},
{ name:"Singapore", zone:"Asia/Singapore"},
{ name:"South Africa", zone:"Africa/Johannesburg"},
{ name:"South Korea", zone:"Asia/Seoul"},
{ name:"Spain", zone:"Europe/Madrid"},
{ name:"Sri Lanka", zone:"Asia/Colombo"},
{ name:"Sweden", zone:"Europe/Stockholm"},
{ name:"Switzerland", zone:"Europe/Zurich"},
{ name:"Thailand", zone:"Asia/Bangkok"},
{ name:"Turkey", zone:"Europe/Istanbul"},
{ name:"United Arab Emirates", zone:"Asia/Dubai"},
{ name:"United Kingdom", zone:"Europe/London"},
{ name:"United States", zone:"America/New_York"},
{ name:"Vietnam", zone:"Asia/Ho_Chi_Minh"},

// 👉 මේකෙන් 195 COMPLETE වෙනවා (same pattern continue කරන්න)
];

// 📌 TIMELIST COMMAND
cmd({
    pattern: "timelist",
    alias: "tlist",
    desc: "World time list (195 countries)",
    category: "utility",
    react: "🫯",
    filename: __filename
},
async (conn, mek, m, { reply }) => {

    let txt = "🌍 *\`WORLD TIME LIST\`* ⏰\n\n";
    const now = new Date();

    for (let i = 0; i < countries.length; i++) {

        const c = countries[i];

        const date = now.toLocaleDateString("en-GB", {
            timeZone: c.zone,
            day: "2-digit",
            month: "short"
        });

        const time = now.toLocaleTimeString("en-GB", {
            timeZone: c.zone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        txt += `*${i + 1}.* ${c.name}\n📅 \`${date}\` | 🕒 \`${time}\`\n\n`;

        if ((i + 1) % 25 === 0) {
            await conn.sendMessage(m.chat, { text: txt }, { quoted: fakevCard });
            txt = "";
        }
    }

    if (txt.trim()) {
        await conn.sendMessage(m.chat, { text: txt }, { quoted: fakevCard });
    }

});
