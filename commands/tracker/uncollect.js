const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = class uncollect extends Command {
    constructor(client){
        super(client, {
            name: "uncollect", 
            description: "Remove an egg from your collection", 
            memberName: "uncollect", 
            group: "tracker", 
            args: [{
                type: "string", 
                prompt: "Which egg?", 
                key: "egg", 
                parse: e => e.toUpperCase()
            }]
        })
    }

    async run(msg, { egg }) { 

        const EGGS = await this.client.dbs.eggs.findOne({DB_ID: process.env.DB_ID})

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

            let embed = new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))

            const P = await this.client.dbs.profile.findOne({userID: msg.author.id})
            if(!P){
                embed.setDescription(stripIndents`You've not marked any eggs as ollected yet!`)
                return msg.say(embed).catch(err => console.log(err))
            }

            const eggExists = EGGS.eggs.find(e => e.name === egg)
            if(!eggExists){
                embed.setDescription(stripIndents`${egg} isn't a valid egg!`)
                return msg.say(embed).catch(err => console.log(err))
            }

            const markedAsCollected = P.collectedEggs.find(e => e === egg)
            if(!markedAsCollected){
                embed.setDescription(stripIndents`You've not marked this egg as collected!`)
                return msg.say(embed).catch(err => console.log(err))
            }

            P.collectedEggs = P.collectedEggs.filter(e => e !== egg)

            P.save().catch(err => console.log(err))

            embed.setDescription(stripIndents`Ok, I marked ${egg} as uncollected!`)
            return msg.say(embed).catch(err => console.log(err))
        }


    }

}