const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { RichDisplay } = require("great-commando")
const { stripIndents } = require("common-tags")


module.exports = class commands extends Command {
  constructor(client) {
    super(client, {
      name: "commands", 
      description: "View Eggburt's commands", 
      memberName: "commands", 
      group: "info", 
    })
  }
  async run(msg) {

    const pages = [
      `**__Egg Info__**
    • egg [egg name] - View info on a specific egg
    • eggs - View a list of all eggs
    
    **__Tracker__**
    • collected [egg name] - Mark an egg as collected
    • uncollect [egg name] - Mark an egg as uncollected
    • collection - View your collected eggs
    
    **__DANGER__**
    • deleteprofile - Delete all stored information stored for you by the bot.
    This deletes your collection data and can not be undone.`,

    `**__Info__**
    • faq - Get a list of frequently asked questions
    • commands - View this embed
    • botinfo - View info on Eggburt
    • privacy - Read Eggburt's privacy policy`

    ]

    let e = new MessageEmbed().setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ dynamic: true })).setColor("#228B22")
    let display = new RichDisplay(e)

    pages.forEach(page => {
      display.addPage(p => p.setDescription(page))
    })

    display.setFooterPrefix(`Commands\nPage: `)
    display.run(await msg.channel.send(`Loading...`), { filter: (reaction, user) => user.id === msg.author.id })

  }
}