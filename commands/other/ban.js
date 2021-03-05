const { Command, CommandDispatcher } = require("discord.js-commando")
const { RichEmbed, MessageEmbed } = require("discord.js")
const superagent = require("superagent")

module.exports = class ban extends Command {
  constructor(client) { 
    super(client, {
      name: "ban", 
      description: "Ban a user",
      group: "other", 
      memberName: "ban", 
      guildOnly: true, 
      args: [{
        type: "string", 
        prompt: "Who?", 
        key: "user",
        parse: u => u.toLowerCase()
      }, {
        type: "string", 
        prompt: "Reason?", 
        key: "reason", 
        default: "No reason provided"
      }]
    })
  }

  async run(msg, { user, reason }){

  
    
    if(!USER) return msg.say(`I couldn't find that user!`)

    if(!msg.member.hasPermission('BAN_MEMBERS')) return msg.say(`You don't have permission to use this command`)
    if(!msg.guild.me.hasPermission('BAN_MEMBERS')) return msg.say(`I need the \`Ban Members\` permission to do this!`)
    if(msg.author.id === USER.id) return msg.say(`Why would you ban yourself?`)
    if(USER.id === this.client.user.id) return msg.say(`Please don't ban me! 😢`)
    if(USER.user && USER.hasPermission('KICK_MEMBERS')) return msg.say('I can not ban this user')

    const settings = await this.client.settings

    await USER.send(`You have been banned from ${msg.guild.name}.\nRason: \`\`\`${reason}\`\`\``).catch(() => {})

    if(USER.user){
      msg.guild.members.ban(USER.user.id, {reason})
    }else{
      msg.guild.members.ban(USER.id, {reason})
    }

    msg.guild.members.ban(USER.user.id, {reason})

    let logChannel = msg.guild.channels.cache.get(settings.punishmentLogs)
    
    let embed = new MessageEmbed()
    .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
    .setColor("RED")
    .setTitle('User Banned')
    .setDescription(`
    User: ${USER.user ? `${USER.user.tag}` : `${USER.tag}`}
    Moderator: ${msg.author.tag}
    
    Reason: \`\`\`${reason}\`\`\``)
    .setTimestamp()

    if(logChannel) logChannel.send(embed).catch(err => console.log(err))
    msg.say(`${USER.user ? `${USER.user.tag}` : `${USER.tag}`} has been banned`)
  }

}