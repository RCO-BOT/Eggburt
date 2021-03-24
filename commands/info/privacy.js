const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { RichDisplay } = require("great-commando")
const Discord = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = class privacy extends Command { 
    constructor(client){
        super(client, {
            name: "privacy", 
            description: "View the privacy policy for this bot", 
            group: "info", 
            memberName: "privacy"
        })
    }

    async run(msg) {

        const owners = this.client.formattedOwners

        const pages = [{
            pageHeader: "IMPORTANT", 
            content: [
                {
                    text: "By using the egg tracking features you consent to us storing the relevant data needed from you to connect you to your database collection"
                }
            ]
        },{
            pageHeader: "What data we collect", 
            content: [
                {
                    text: "Your Discord user ID - This is public and accessible by every Discord users. We use this ID to link you to your database collection"
                }
            ]
        }, {
            pageHeader: "How long we store data for", 
            content: [
                {
                    text: "The database will be deleted at the end of the Roblox 2021 Egg Hunt"
                },
                {
                    text: "Leaving the DeeterPlays Discord server will not remove your data"
                }, 
                {
                    text: "You can request deletion of data [See: 'How to delete data']"
                }
            ]
        }, {
            pageHeader: "How can I delete my data?", 
            content: [
                {
                    text: `You can either contact ${owners} or you can delete your data using \`${this.client.commandPrefix}deleteprofile\``
                }
            ]
        }, {
            pageHeader: "How can I request my data?", 
            content: [
                {
                    text: `Contact ${owners}.\nPlease note, For data protection reasons we will only be able to provide data on the account used to contact us.`
                }
            ]
        }]


        let e = new Discord.MessageEmbed().setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ dynamic: true })).setColor("#228B22")

        let display = new RichDisplay(e)

        pages.forEach(page => {
            display.addPage(e => e.setTitle(page.pageHeader), e.setDescription(stripIndents`${page.content.map(c => `• ${c.text}`).join('\n\n')}`))
        })

        display.setFooterPrefix(`Page: `)
        display.run(await msg.channel.send(`Loading...`), { filter: (reaction, user) => user.id === msg.author.id })
    }

}
