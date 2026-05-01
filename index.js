const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// user stats
const users = {};

// personality system
function getPersonality(u) {
    if (u.toxic >= 10) return "Chaos Agent 😈";
    if (u.helpful >= 10) return "Server Guardian 🛡️";
    if (u.messages >= 100) return "Terminally Online 💀";
    if (u.messages <= 10) return "Lurker 👀";
    return "Balanced Human 🙂";
}

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

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

    if (text.includes("thanks") || text.includes("thank you")) {
        u.helpful++;
    }

    if (text.includes("stupid") || text.includes("idiot") || text.includes("shut up")) {
        u.toxic++;
    }

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

    if (text === "!ping") {
        message.reply("Pong 🧪");
    }
});

// 🔴 PUT YOUR TOKEN HERE
client.login("MTQ5OTgwMDk3MDQzODM3NzczNQ.GsqzLG.3WpmMiMa6PWHtVJvgdwnAq7j7o4ovtp3fP8Kr0");