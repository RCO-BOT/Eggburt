const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")
 
module.exports = class addegg extends Command {
    constructor(client) {
        super(client, {
            name: "addegg",
            description: "Add an egg to the database",
            group: "owner",
            memberName: "addegg",
            aliases: ["ae"],
            ownerOnly: true,
            args: [{
                type: "string",
                prompt: "What is the YouTube link to this egg?",
                key: "link"
            },{
                type: "string",
                prompt: "What's the egg name?",
                key: "name",
                parse: n => n.toUpperCase()
            }]
        })
    }

    async run(msg, { link, name }) {

        const vidData = await this.client.functions.getMeta.getMetaData(link)
        const thumbnail = vidData.thumbnails.high.url
        const title = vidData.title

        const addedEmbed = new MessageEmbed()
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`New egg added!`)
        .setDescription(stripIndents`
            Egg Name: ${name}
            Link: [${title}](${link})`)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(`Added By: ${msg.author.username}`, msg.author.displayAvatarURL({ dynamic: true }))
        thumbnail ? addedEmbed.setImage(thumbnail) : null

        const EGGS = await this.client.dbs.eggs.findOne({ DB_ID: process.env.DB_ID })
        if (!EGGS) {
            new this.client.dbs.eggs({
                DB_ID: process.env.DB_ID,
                eggs: [{ name, link, title, thumbnail }]
            }).save().catch(err => console.log(err))
            return msg.say(addedEmbed).catch(err => console.log(err))
        }

        const eggExists = EGGS.eggs.find(e => e.name === name)
        if (eggExists) {
            return msg.say(new MessageEmbed()
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`An egg named: \`${name}\` already exists in the database`)
                .setTimestamp())
        } else {
            EGGS.eggs.push({ name, link, name, thumbnail })

            EGGS.save().catch(err => console.log(err))
            return msg.say(addedEmbed).catch(err => console.log(err))
        }
    }
}