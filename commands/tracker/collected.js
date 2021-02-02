const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = class collected extends Command { 
    constructor(client){
        super(client, {
            name: "collected", 
            description: "Mark an egg as collected!",
            group: "tracker", 
            memberName: "collected",
            args: [{
                type: "string", 
                prompt: "Which egg have you collected?", 
                key: "egg", 
                parse: e => e.toUpperCase()
            }]
        })
    }
    async run(msg, { egg }){

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
            let findEgg = EGGS.eggs.find(e => e.name === egg)
            if(!findEgg) return msg.say(`This isn't a valid egg`)

            const P = await this.client.dbs.profile.findOne({userID: msg.author.id})
            if(!P){
                new this.client.dbs.profile({
                    userID: msg.author.id, 
                    collectedEggs: [egg]
                }).save().catch(err => console.log(err))

                let owners = this.client.formattedOwners

                return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(stripIndents`Congratulations on collecting the ${egg.replace(`_`, ' ')}
                
                **IMPORTANT**: By using this bot you concent to our [insert privacy policy channel].
                If you have any questions or wish to remove data stored on you please contact ${owners}`)
                .setColor("RED")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            }else if(P.collectedEggs.includes(egg)){
                return msg.say(`You've already collected this egg`)
            }else{
                P.collectedEggs.push(egg)
                P.save().catch(err => console.log(err))
                return msg.say(`Ok, I marked ${egg} as collected`)
            }

        }

    }
}