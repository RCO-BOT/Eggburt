const { CommandoClient } = require("discord.js-commando")
const { join } = require("path") 
const { MessageEmbed, WebhookClient } = require("discord.js")
const mongoose = require("mongoose")
const { config } = require("dotenv")
config()        


       const client = new CommandoClient({ 
        commandPrefix: '.',
        owner: process.env.OWNERS ? process.env.OWNERS.split("|") : [],
        invite: "",
        messageCacheLifetime: 60,
        messageCacheMaxSize: 30,
        fetchAllMembers: false, 
        messageSweepInterval: 60,
        restTimeOffset: 0,
        http: {
            host: `https://discord.com`,
            api: `https://discord.com/api`
        },
        ws: {
            intents: [
                "GUILD_MESSAGES",
                "GUILDS",
                "DIRECT_MESSAGES",
                "DIRECT_MESSAGE_REACTIONS",
                "GUILD_MESSAGE_REACTIONS"
            ],

            // properties: {
            //        $browser: "Discord Android"
            //      }
        }
    });

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['main', 'Main'], 
        ['owner', 'Owner'], 
        ['tracker', 'Tracker'], 
        ['info', 'Info']

    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        unknownCommand: false,
        help: false
    })

.registerCommandsIn(join(__dirname, 'commands'));

let folders = [
    "owner",
];

for (const folder of folders) {
    client.registry.registerCommandsIn(join(__dirname, `commands/${folder}/`));
}

config({
    path: __dirname + "/.env"
});

mongoose.connect(process.env.MONGODB, {
    keepAlive: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})
    .then(() => console.log(`Mongodb | (Connected)`))
    .catch((err) => {
        console.log(`Mongodb | (Error)\n`, err.stack);
    })

global.servers = {};

//Databases
client.dbs = {
    eggs: require("./models/eggs"), 
    profile: require("./models/profile")
}

client.functions = {
    getMeta: require("./functions/getMeta")
}

client.commonEmojis = {
    tick: "798518287528755200", 
    cross: "798518287537143828"
}

client.missingDBErrorSent = false
client.formattedOwners = [...process.env.owners.split('|')].map(u => `<@${u}>`).join(' or ')

client.once('ready', async () => {

    console.log(`Alive and ready to do eggy stuffs!`)

    client.user.setPresence({
        activity: {
            name: 'Egg Hunt 2021!',
            type: "PLAYING"
        }
    })
})


//Error logging

const webhooks = {
    errors: process.env.ERROR_HOOK,
}

const webhook = async (url, embed) => {

    if (!embed || embed === null || embed === undefined) return `[Webhook Function] - Error, you need to provide content or an embed!`
    let link = await url.replace('https://discord.com/api/webhooks/', '').split("/");
    let hook = new WebhookClient(link[0], link[1]);
    return hook.send(embed).catch(() => { });
};

client.on("commandError", (cmd, error, msg, args, fromPatter, result) => {
    console.log(`${cmd.name} - (Error)`, error.stack)
    let embed = new MessageEmbed()
        .setAuthor(`${msg.guild ? `Server: ${msg.guild.name} (${msg.guild.id})` : `DM: @${msg.author.tag} (${msg.author.id})`}`, msg.guild ? msg.guild.iconURL({ dynamic: true }) : msg.author.displayAvatarURL({ dynamic: true }))
        .setTitle(`Command "${msg.command.name}"  **Error**`)
        .setFooter(`Reported At`)
        .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
        .setTimestamp()
        .setColor(`#FF8300`)
    msg.guild ? embed.addField(`Server`, `${msg.guild.name} (${msg.guild.id})`) : embed.addField(`DM`, `@${msg.author.tag} (${msg.author.id})`)
    msg.channel.type === "text" ? embed.addField(`Channel`, `${msg.channel.name} (${msg.channel.id})`) : null
    embed.addField(`User`, `${msg.author} \`@${msg.author.tag}\` (${msg.author.id})`)
    webhook(webhooks.errors, embed)
});

client.on(`error`, (err) => {
    if (err === undefined || err === "undefined") return null;
    if (!err) return null;
    if (!err.stack) return null;
    if (err.stack === "undefined") return null;
    let ignoreErrors = [
        `DiscordAPIError: Unknown Message`,
        `DiscordAPIError: Missing Permissions`,
        `DiscordAPIError: Missing Access`,
        `DiscordAPIError: Unknown Channel`,
        `DiscordAPIError: Cannot send messages to this user`,
        "DiscordAPIError: Cannot execute action on a DM channel"
    ], there = [];
    for (const ignore of ignoreErrors) {
        if (err.stack.includes(ignore)) there.push(true);
    };
    if (there.length !== 0) return null;
    webhook(webhooks.errors,
        new MessageEmbed()
            .setTitle(`Discord Error`)
            .setDescription(`\`\`\`js\n${err.stack}\`\`\``)
            .setColor(`#FAFF00`)
            .setTimestamp()
            .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
    )
});

process.on('unhandledRejection', error => {
    let ignoreErrors = [
        `DiscordAPIError: Unknown Message`,
        `DiscordAPIError: Missing Permissions`,
        `DiscordAPIError: Missing Access`,
        `DiscordAPIError: Unknown Channel`,
        `DiscordAPIError: Cannot send messages to this user`,
        "DiscordAPIError: Cannot execute action on a DM channel"
    ], there = [];
    for (const ignore of ignoreErrors) {
        if (error.stack.includes(ignore)) there.push(true);
    };
    if (there.length !== 0) return null;
    console.log(`UnhandledRejection: \n${error.stack}`);
    webhook(webhooks.errors,
        new MessageEmbed()
            .setColor(`#FF0000`)
            .setTimestamp()
            .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
            .setTitle(`Unhandled Rejection`)
            .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
    )
}).on('uncaughtException', error => {
    console.log(`UncaughtException: \n${error.stack}`);
    webhook(webhooks.errors,
        new MessageEmbed()
            .setColor(`#FF0000`)
            .setTimestamp()
            .setFooter(`The process will be ending in 2s due to this.`)
            .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
            .setTitle(`Uncaught Exception`)
            .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
    );
    setTimeout(() => process.exit(1), 2000);
});


client.login(process.env.TOKEN).catch((err) => {
    console.log(`Client Login Issue\n`, err.stack);
})

