const { Command } = require("discord.js-commando")

module.exports = class say extends Command { 
    constructor(client) {
        super(client, {
            name: "say", 
            description: "The bot will repeat back whatever you ask it to", 
            group: "other", 
            memberName: "say", 
            aliases: ["repeat", "echo"], 
            args: [{
                type: "string", 
                prompt: "What do you want me to say?", 
                key: "string"
            }] 
        })
    }
    async run(msg, { string }){

        msg.say(string).catch(err => console.log(err))

        
    }
}