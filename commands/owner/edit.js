const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

module.exports = class edit extends Command { 
    constructor(client){
        super(client, {
            name: "edit", 
            description: "Edit an egg's properties", 
            memberName: "edit", 
            group: "owner", 
            ownerOnly: true, 
            args: [{
                type: "string", 
                prompt: "Which egg?", 
                key: "eggToEdit", 
                parse: e => e.toUpperCase()
            },{
                type: "string", 
                prompt: "Are you editing the `name` or `link`?", 
                key: "changeType", 
                oneOf: ["name", "link"], 
                parse: e => e.toLowerCase()
            }, {
                type: "string", 
                prompt: "What is the new value?", 
                key: "newValue",
            }]
        })
    }
    async run(msg, { eggToEdit, changeType, newValue }){

        let embed = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setColor("RADNOM")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))

        const EGGS = await this.client.dbs.eggs.findOne({DB_ID: process.env.DB_ID})
        if(!EGGS) return embed.setTitle(`The egg database is missing`), 
        msg.say(embed).catch(err => console.log(err))

        if(EGGS.eggs.length < 1) return embed.setTitle(`There are no eggs in the database`), 
        msg.say(embed).catch(err => console.log(err))

        const findEgg = EGGS.eggs.filter(e => e.name.includes(eggToEdit))[0]
        if(!findEgg) return embed.setTitle(`I couldn't find an egg named: ${eggToEdit} in the database`), 
        msg.say(embed).catch(err => console.log(err))

        switch(changeType){
            case "name" : {
                findEgg.name = newValue.toUpperCase()
                EGGS.markModified(`eggs`)
                EGGS.save().catch(err => console.log(err))
                embed.setTitle(`Name updated`)
                msg.say(embed).catch(err => console.log(err))
            } 
            break
            case "link" : {
                const vidData = await this.client.functions.getMeta.getMetaData(newValue)
                const thumbnail = vidData.thumbnails.high.url

                findEgg.link = newValue
                findEgg.thumbnail = thumbnail

                EGGS.markModified(`eggs`)
                EGGS.save().catch(err => console.log(err))
                embed.setTitle(`Name updated`)
                msg.say(embed).catch(err => console.log(err))
            }
            break
        }

    }
}