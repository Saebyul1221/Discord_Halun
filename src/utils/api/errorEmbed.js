const Discord = require("discord.js")

module.exports = (message) => {
  const embed = new Discord.MessageEmbed()
  embed.setTitle("오류!")
  embed.setFooter({ text: message.author.tag, iconURL: message.author.avatarURL() })
  embed.setTimestamp(new Date())
  embed.setColor("#FF4246")
  return embed
}
