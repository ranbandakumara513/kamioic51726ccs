const axios = require('axios');
const { cmd } = require('../command');

const menuImage = "https://files.catbox.moe/t66qvb.jpg";

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

let activeMenus = {}; // 🔥 simple session tracking


// ================= MENU =================
cmd({
    pattern: "newsmenu",
    desc: "News menu",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from }) => {

    let menuText = `
📰 *NEWS MENU*

1️⃣ Sirasa News  
2️⃣ BBC News  

👉 Reply with *1* or *2*
`;

    let sentMsg = await conn.sendMessage(from, {
        image: { url: menuImage },
        caption: menuText
    }, { quoted: fakevCard });

    // Save menu message id
    activeMenus[from] = sentMsg.key;

});


// ================= HANDLE REPLY =================
cmd({
    on: "text"
},
async (conn, mek, m, { from, body }) => {

    try {

        // must have quoted message
        if (!m.quoted) return;

        let quotedText =
            m.quoted.message?.conversation ||
            m.quoted.text ||
            "";

        // check if it is menu
        if (!quotedText.includes("NEWS MENU")) return;

        let text = body.trim();

        if (text === "1") {
            await conn.sendMessage(from, {
                react: { text: "⏳", key: m.key }
            });

            await sendSirasa(conn, from, m);

        } else if (text === "2") {
            await conn.sendMessage(from, {
                react: { text: "⏳", key: m.key }
            });

            await sendBBC(conn, from, m);

        }

    } catch (e) {
        console.log(e);
    }

});


// ================= SIRASA =================
async function sendSirasa(conn, from, m) {
    try {

        const res = await axios.get("https://appi.srihub.store/news/sirasa?apikey=dew_1TqE8N6MtFQH7myhpydg9K0XCgjNJVwyUJEE0Pic");

        if (!res.data.status) {
            return await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
        }

        const newsList = Array.isArray(res.data.result)
            ? res.data.result
            : [res.data.result];

        for (let news of newsList) {

            let msg = `
📰 *${news.title}*

📅 ${news.date}

${news.desc}

🔗 ${news.url}
            `;

            if (news.image) {
                await conn.sendMessage(from, {
                    image: { url: news.image },
                    caption: msg
                });
            } else {
                await conn.sendMessage(from, { text: msg });
            }

            await new Promise(r => setTimeout(r, 500));
        }

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (err) {
        console.log(err);
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
    }
}


// ================= BBC =================
async function sendBBC(conn, from, m) {
    try {

        const res = await axios.get("https://appi.srihub.store/news/bbc?apikey=dew_1TqE8N6MtFQH7myhpydg9K0XCgjNJVwyUJEE0Pic");

        if (!res.data.status) {
            return await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
        }

        const newsList = Array.isArray(res.data.result)
            ? res.data.result
            : [res.data.result];

        for (let news of newsList) {

            let msg = `
📰 *${news.title}*

📅 ${news.date}

${news.desc}

🔗 ${news.url}
            `;

            if (news.image) {
                await conn.sendMessage(from, {
                    image: { url: news.image },
                    caption: msg
                });
            } else {
                await conn.sendMessage(from, { text: msg });
            }

            await new Promise(r => setTimeout(r, 500));
        }

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (err) {
        console.log(err);
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
    }
             }
