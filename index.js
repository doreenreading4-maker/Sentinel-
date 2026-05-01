require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// user memory
const users = {};

// personality system
function getPersonality(u) {
    if (u.toxic >= 10) return "Chaos Agent 😈";
    if (u.helpful >= 10) return "Server Guardian 🛡️";
    if (u.messages >= 100) return "Terminally Online 💀";
    if (u.messages <= 10) return "Lurker 👀";
    return "Balanced Human 🙂";
}

// ready event
client.once('clientReady', () => {
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

    // helpful tracking
    if (text.includes("thanks") || text.includes("thank you")) {
        u.helpful++;
    }

    // toxic tracking
    if (text.includes("stupid") || text.includes("idiot") || text.includes("shut up")) {
        u.toxic++;
    }

    // personality command
    if (text === "!personality") {
        const type = getPersonality(u);

        message.reply(
`🧠 Personality Report

📊 Messages: ${u.messages}
🤝 Helpful: ${u.helpful}
⚠️ Toxic: ${u.toxic}

🎭 Type: ${type}`
        );
    }

    // test command
    if (text === "!ping") {
        message.reply("Pong 🧪");
    }
});

// LOGIN (works for both local + Render)
client.login(process.env.TOKEN);

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Bot is alive');
});

app.listen(3000);