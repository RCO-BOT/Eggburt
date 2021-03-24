const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { RichDisplay } = require("great-commando")
const Discord = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = class faq extends Command {
    constructor(client) {
        super(client, {
            name: "faq",
            description: "READ THIS BEFORE ASKING QUESTIONS",
            memberName: "faq",
            group: "info"
        })
    }
    async run(msg) {


        const groups = [
            [
                {
                    groupName: "Deeter",
                    content: [
                        {
                            question: `Can I DM Deeter?`,
                            answer: `Unfortunatly not. If he opened his DMs to everyone the notifications would probably blow his computer up! `
                        },
                        {
                            question: `Can I add Deeter?`,
                            answer: `Deeter isn't accepting any friend requests any time soon`
                        },
                        {
                            question: `How do I contact Deeter?`,
                            answer: `The best way to contact Deeter is by [Twitter](https://twitter.com/DeeterPlays)`
                        },
                        {
                            question: `Can I ping Deeter?`,
                            answer: `No. This breaks our server rules and you'll be muted for 1h for each ping!`
                        }
                    ]
                }
            ], 
            [
                {
                    groupName: "Event", 
                    content: [
                        {
                            question: `When is Deeter launching [x] Egg?`, 
                            answer: `To ensure you never miss a livestream, Turn on channel notifications and head over to <#550352487953989642> and click the '🏓' for the Notification Squad role to be pinged in this server everytime Deeter goes live/`
                        }, 
                        {
                            question: `I need [x] egg!`, 
                            answer: `There's loads of people who still need [x] egg! Deeter will do his best to make sure you get that egg, Have patience!`
                        }, {
                            question: `How do I join Deeter?`, 
                            answer: `During live streams Deeter will post his private server links for you to join him!
                            Alternatively you can [follow](https://www.roblox.com/users/178236960/profile) him into game`
                        }, {
                            question: `How do I get help from <@&822143327603261531>?`, 
                            answer: `Ask them! Do not bug them. They will do their best to help everyone.`
                        }
                    ]
                }
            ], 
            [
                {
                    groupName: "For New Members", 
                    content: [
                        {
                            question: `Why can't a see the whole server?`, 
                            answer: `Egg hunts are crazy for the server. We have set things up differently this year.
                            Anyone who joins **during** this years egg hunt will have limited acces to the server.
                            Do not worry, You will not miss anything! 
                            You will have access to the \`Egg Hunt\` category that contains the same info as the rest of the server`
                        }, {
                            question: `When will I get access to the full server?`, 
                            answer: `As soon as the event ends you will be asked to react to a message if you wish to stay giving you the necessary roles for full server access. Do not ask us to give you access early. Your request will be ignored.`
                        }
                    ]
                }
            ]
        ]

        let e = new Discord.MessageEmbed().setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ dynamic: true })).setColor("#228B22")
        let display = new RichDisplay(e)

        //Pages per group
        groups.forEach(group => {
            display.addPage(p => p.setDescription(stripIndents`${group.map(g => `${g.groupName}\n\n ${g.content.map(c => `Q: ${c.question}\nA: ${c.answer}\n---------`).join(`\n`)}`).join('\n')}`))
        })

        display.setFooterPrefix(`FAQ\nPage: `)
        display.run(await msg.channel.send(`Loading...`), { filter: (reaction, user) => user.id === msg.author.id })

    }
}