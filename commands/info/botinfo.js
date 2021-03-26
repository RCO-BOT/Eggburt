const { Command } = require("discord.js-commando")
const { RichMenu } = require("great-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")
const moment = require("moment")
require("moment-duration-format")
const CPU = require('cpu-stat')

module.exports = class botinfo extends Command { 
    constructor(client){
        super(client, { 
            name:"botinfo", 
            description: "View the bot's info",
            group: "info", 
            memberName: "botinfo",
            aliases: ["bi", "info"]
        })
    }
    async run(msg) {

        let pl = { "win32": "Windows", "linux": "Linux", "darwin": "Darwin", "undefined": "Unknown" }
        const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        
        msg.say(new MessageEmbed()
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`Created by ${this.client.users.cache.get(`${[...process.env.OWNERS.split('|')][0]}`)}

            \`\`\`diff
            - A ValAlpha Production
            \`\`\`
            
            **__System Info__**
            **CPU: **${CPU.totalCores()} Cores ${CPU.avgClockMHz()}MHz
            **Memory Used: **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
            **Operating System: **${pl[process.platform]}
            **Uptime** ${duration}
            **Bot Created On** ${moment(this.client.user.createdAt).format(`MMMM Do YYYY, h:mm:ss a`)} (**${moment(this.client.user.createdAt, "MMMM Do YYYY, h:mm:ss a").fromNow()}**)
            **Default prefix**: \`${this.client.commandPrefix}\` or \`@${this.client.user.username}\``)
            .setThumbnail(this.client.user.displayAvatarURL({dynamic: true}))
            .setColor("#FF0000")
            .setTimestamp()
            .setFooter('Have a great day!')).catch(err => { })

    }
}
