const { Command } = require("discord.js-commando")
const { MessageEmbed, Message } = require("discord.js")
const { stripIndent } = require("common-tags")

module.exports = class deleteegg extends Command {
    constructor(client) {
        super(client, {
            name: "deleteegg", 
            description: "Remove an egg from the database by name", 
            group: "owner",
            memberName: "deleteegg", 
            aliases: ["de"], 
            args: [{
                type: "string", 
                prompt: "What's the egg's name?", 
                key: "name", 
                parse: e => e.toUpperCase()
            }] 
            
        })
    }

    async run(msg, { name }){

        const EGGS = await this.client.dbs.eggs.findOne({ DB_ID: process.env.DB_ID })

        if(!EGGS) return msg.say(`The eggs database is missing!`).catch(err => console.log(err))

        let eggExist = EGGS.eggs.find(e => e.name === name)

        if(!eggExist) return msg.say(new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setTitle(`Couldn't find an egg named ${name} in the database!`)
        .setColor("RED")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(err => console.log(err))

        EGGS.eggs = EGGS.eggs.filter(e => e.name !== name)
        EGGS.eggsInDB--
        EGGS.save().catch(err => console.log(err))

        return msg.say(new MessageEmbed()
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
        .setTitle(`${name} has been deleted from the database`)
        .setColor("GREEN")
        .setTimestamp()).catch(err => console.log(err))


        
    }

}