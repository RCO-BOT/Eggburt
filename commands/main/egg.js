const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = class egg extends Command {
    constructor(client) {
        super(client, {
            name: "egg",
            description: "View information on an egg",
            memberName: "egg",
            group: "main",
            args: [{
                type: "string", 
                prompt: "Which egg are you searching for?", 
                key: "egg", 
                parse: e => e.toUpperCase()
            }]
        })
    }

    async run(msg, { egg }) {

        const EGGS = await this.client.dbs.eggs.findOne({ DB_ID: process.env.DB_ID })

        const dbErrMsg = `Error finding egg database. The developers are aware and are currently working on a fix. There is no need to report this to them.`

        if (!EGGS) {

            if (this.client.missingDBErrorSent === false) {
                this.client.missingDBErrorSent = true
                msg.say(dbErrMsg).catch(err => console.log(err))
                this.client.owners.forEach(o => {
                    this.client.users.cache.get(o.id).send(`[Database missing] - CMD: \`eggs\``).catch(() => { })
                    return
                })
            } else if (this.client.missingDBErrorSent === true) {
                return msg.say(dbErrMsg).catch(err => console.log(err))
            }
        } else {


            let eggToFind = EGGS.eggs.find(e => e.name === egg)
            if(!eggToFind) return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Couldn't find an egg named ${egg.toUpperCase()}`)
            .setDescription(stripIndents`- Check spelling
            - Check \`${this.client.commandPrefix}eggs\` to see a list of all eggs`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(err => console.log(err))
            
            msg.say(new MessageEmbed()
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(stripIndents`
                Egg Name: ${eggToFind.name}
                [YouTube Link](${eggToFind.link})`)
                .setImage(eggToFind.thumbnail)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(`Egg Count: ${EGGS.eggs.length}`, this.client.user.displayAvatarURL({ dynamic: true }))
            ).catch(err => console.log(err))
        }
    }

}