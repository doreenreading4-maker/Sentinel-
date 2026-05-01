require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// web server (for uptime)
const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Bot is running ✔');
});

app.listen(3000, () => {
    console.log('Health check running');
});

// user memory
const users = {};

function getPersonality(u) {
    if (u.toxic >= 10) return "Chaos Agent 😈";
    if (u.helpful >= 10) return "Server Guardian 🛡️";
    if (u.messages >= 100) return "Terminally Online 💀";
    if (u.messages <= 10) return "Lurker 👀";
    return "Balanced Human 🙂";
}

// ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// message system
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const id = message.author.id;

    if (!users[id]) {
        users[id] = {
            messages: 0,
            helpful: 0,
            toxic: 0
        };
    }

    const u = users[id];
    u.messages++;

    const text = message.content.toLowerCase();

    const badWords = ["stupid", "idiot", "shut up"];

    if (badWords.some(word => text.includes(word))) {
        u.toxic++;
    }

    if (text.includes("thanks") || text.includes("thank you")) {
        u.helpful++;
    }

    if (text === "!personality") {
        message.reply(`🧠 Personality Report

📊 Messages: ${u.messages}
🤝 Helpful: ${u.helpful}
⚠️ Toxic: ${u.toxic}

🎭 Type: ${getPersonality(u)}`);
    }

    if (text === "!ping") {
        message.reply("Pong 🧪");
    }
});

// login
client.login(process.env.TOKEN);