require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials
} = require('discord.js');

// -------------------- BOT SETUP --------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

// -------------------- KEEP ALIVE (Render SAFE) --------------------

require('http')
    .createServer((req, res) => {
        res.end('Bot is running ✔');
    })
    .listen(3000);

// -------------------- USER DATA --------------------

const users = {};

// -------------------- PERSONALITY SYSTEM --------------------

function getPersonality(u) {
    if (u.toxic >= 10) return "Chaos Agent 😈";
    if (u.helpful >= 10) return "Server Guardian 🛡️";
    if (u.messages >= 100) return "Terminally Online 💀";
    if (u.messages <= 10) return "Lurker 👀";
    return "Balanced Human 🙂";
}

// -------------------- READY --------------------

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} 🚀`);
});

// -------------------- MESSAGE HANDLER --------------------

client.on('messageCreate', (message) => {
    if (!message.guild) return; // ignore DMs if needed
    if (message.author.bot) return;

    const id = message.author.id;
    const text = message.content.toLowerCase();

    if (!users[id]) {
        users[id] = {
            messages: 0,
            helpful: 0,
            toxic: 0
        };
    }

    const u = users[id];
    u.messages++;

    // helpful tracking 💙
    if (text.includes("thanks") || text.includes("thank you")) {
        u.helpful++;
    }

    // toxic tracking ⚠️
    const badWords = ["stupid", "idiot", "shut up"];

    if (badWords.some(w => text.includes(w))) {
        u.toxic++;
    }

    // -------------------- COMMANDS --------------------

    if (text === "!personality" || text === "!stats") {
        return message.reply(
`🧠 Personality Report

📊 Messages: ${u.messages}
🤝 Helpful: ${u.helpful}
⚠️ Toxic: ${u.toxic}

🎭 Type: ${getPersonality(u)}`
        );
    }
});

// -------------------- LOGIN --------------------

client.login(process.env.TOKEN);