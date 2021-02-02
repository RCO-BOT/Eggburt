const { Command } = require("discord.js-commando")
const { RichEmbed, Message, MessageEmbed } = require("discord.js")
const { stripIndent } = require("common-tags")

module.exports = class deleteprofileyes extends Command { 
    constructor(client) {
        super(client, {
            name: "deleteprofile", 
            description: "Delete your egg tracker profile (Can not be undone!)", 
            memberName: "deleteprofile", 
            group: "tracker", 
            aliases: ['dp'], 
            args: [{
                type: "string",
                prompt: "Are you sure you want to delete your profile? This will delete all data stored for you! `YES` or `NO`", 
                key: "answer",
                oneOf: ["yes", "no"],
                parse: a => a.toLowerCase() 
            }]
        })
    }

    async run(msg, { answer }){

        const P = await this.client.dbs.profile.findOne({userID: msg.author.id})
        if(!P) return msg.reply(`You have no profile to delete`)

        let embed = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setColor("RANDOM")
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))

        switch(answer){
            case 'no' : embed.setDescription(stripIndent`Ok, Nothing was deleted!`)
            break
            case 'yes' : {
                P.remove()
                embed.setDescription(stripIndent`Ok, All data stored for you has been deleted!`)
            }
            break
        }

        return msg.say(embed).catch(err => console.log(err))

    }

}