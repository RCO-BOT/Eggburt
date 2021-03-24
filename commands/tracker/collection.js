const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { RichDisplay } = require("great-commando")
const Discord = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = class collection extends Command {
    constructor(client) {
        super(client, {
            name: "collection",
            description: "View all eggs you've collected",
            group: "tracker",
            memberName: "collection"

        })
    }

    async run(msg) {

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

        const P = await this.client.dbs.profile.findOne({ userID: msg.author.id })
        const owners = this.client.formattedOwners
        let newProfile = false
        if (!P) {
            new this.client.dbs.profile({
                userID: msg.author.id,
                collectedEggs: []
            }).save().catch(err => console.log(err))
            newProfile = true
        }

        let e = new Discord.MessageEmbed().setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ dynamic: true })).setColor("#228B22")

        let display = new RichDisplay(e)

        switch (newProfile) {
            case false: {

                let collectedEggs = P.collectedEggs.length
                let neededEggs = EGGS.eggs.length
                let perc = (collectedEggs / neededEggs) * 100
                let forBar = perc / 10
                
                const getBar = (rating = 0) => {
                    return `${`▮`.repeat(rating)}${"▯".repeat(10 - rating)}`
                };
                let bar = getBar(forBar);
                
                let progressBar = `${bar} ${Math.round(perc)}%\nEggs collected: ${collectedEggs} / ${neededEggs}`

                const tickEmoji = this.client.emojis.cache.get(this.client.commonEmojis.tick)
                const crossEmoji = this.client.emojis.cache.get(this.client.commonEmojis.cross)
                
                const eggs = Array.from(EGGS.eggs).map(e => e.name)
                const eggsPerPage = 10
                const chunks = new Array(Math.ceil(eggs.length / eggsPerPage)).fill().map(_ => eggs.splice(0, eggsPerPage).sort((a, b) => P.collectedEggs.includes(b) - P.collectedEggs.includes(a)).map(egg => `• ${egg.toUpperCase()} | ${P.collectedEggs.includes(egg) ? tickEmoji : crossEmoji }`))

                if(chunks.length > 0){
                    chunks.forEach(chunk => {
                        display.addPage(e => e.setDescription(stripIndents`${chunk.join('\n')}`))
                    })
                }else{
                    display.addPage(e => e.setDescription(stripIndents`You've not marked any eggs as collected yet!`))
                }
                display.setFooterPrefix(`${progressBar}\nPage: `)

            }
            break
            case true: display.addPage(e => e.setTitle(`You've not marked any eggs as collected yet!`).setDescription(stripIndents`**IMPORTANT**: By using this bot you concent to our [insert privacy policy channel].
            If you have any questions or wish to remove data stored on you please contact ${owners}`))
            break
        }

        
        display.run(await msg.channel.send(`Loading...`), { filter: (reaction, user) => user.id === msg.author.id })

        }


        

    }
}
