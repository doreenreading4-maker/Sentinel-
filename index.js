require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// -------------------- BOT SETUP --------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// -------------------- KEEP ALIVE SERVER --------------------

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Bot is running ✔');
});

app.listen(3000, () => {
    console.log('Health check server running');
});

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

    // helpful tracking
    if (text.includes("thanks") || text.includes("thank you")) {
        u.helpful++;
    }

    // toxic tracking (safe version)
    const badWords = ["stupid", "idiot", "shut up"];

    if (badWords.some(word => text.includes(word))) {
        u.toxic++;
    }

    // -------------------- COMMANDS --------------------

    // personality
    if (text === "!personality") {
        return message.reply(
`🧠 Personality Report

📊 Messages: ${u.messages}
🤝 Helpful: ${u.helpful}
⚠️ Toxic: ${u.toxic}

🎭 Type: ${getPersonality(u)}`
        );
    }

    // ping
    if (text === "!ping") {
        return message.reply("Pong 🧪");
    }

    // leaderboard
    if (text === "!leaderboard") {
        const sorted = Object.entries(users)
            .sort((a, b) => b[1].messages - a[1].messages)
            .slice(0, 10);

        if (sorted.length === 0) {
            return message.reply("No data yet 📊");
        }

        let board = "🏆 **Leaderboard (Most Active Users)**\n\n";

        for (let i = 0; i < sorted.length; i++) {
            const userId = sorted[i][0];
            const data = sorted[i][1];

            let username = "Unknown";

            try {
                const user = await client.users.fetch(userId);
                username = user.username;
            } catch {}

            board += `#${i + 1} **${username}** — ${data.messages} messages\n`;
        }

        message.reply(board);
    }
});

// -------------------- LOGIN --------------------

client.login(process.env.TOKEN);