require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

// -------------------- DEBUG TOKEN (IMPORTANT) --------------------

console.log("TOKEN LOADED:", process.env.TOKEN ? "YES" : "NO");
console.log("TOKEN LENGTH:", process.env.TOKEN?.length);

// -------------------- BOT SETUP --------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// -------------------- KEEP ALIVE (Render SAFE) --------------------

require('http')
    .createServer((req, res) => {
        res.end('Bot is running ✔');
    })
    .listen(3000);

// -------------------- USER DATA --------------------

const users = {};

// -------------------- PERSONALITY --------------------

function getPersonality(u) {
    if (u.toxic >= 10) return "Chaos Agent 😈";
    if (u.helpful >= 10) return "Server Guardian 🛡️";
    if (u.messages >= 100) return "Terminally Online 💀";
    if (u.messages <= 10) return "Lurker 👀";
    return "Balanced Human 🙂";
}

// -------------------- READY EVENT --------------------

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// -------------------- MESSAGE SYSTEM --------------------

client.on('messageCreate', async (message) => {
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

    if (text.includes("thanks") || text.includes("thank you")) {
        u.helpful++;
    }

    const badWords = ["stupid", "idiot", "shut up"];

    if (badWords.some(word => text.includes(word))) {
        u.toxic++;
    }

    if (text === "!personality") {
        return message.reply(`Your personality is: ${getPersonality(u)}`);
    }
});

// -------------------- LOGIN --------------------

client.login(process.env.TOKEN);