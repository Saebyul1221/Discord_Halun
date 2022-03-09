const Event = require("../structures/Event")
const handling = require("../utils/error")
const { MessageEmbed, Message } = require("discord.js")

module.exports = class extends Event {
  async run(message) {
    handling.setMessage(message)
    const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`)
    if (!message.guild || message.author.bot) return

    if (message.content.match(mentionRegex))
      message.channel.send(`제 접두사는 \`${this.client.prefix}\` 이에요!`)

    const prefix = this.client.prefix
    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)

    if (!message.content.startsWith(prefix)) return
    const command =
      this.client.commands.get(cmd.toLowerCase()) ||
      this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))

    const embed = require("../utils/api/embed")(message)
    const customCmd = message.content.split(" ")[0] || undefined
    if (customCmd && !message.content.startsWith(prefix)) {
      const data = await this.client.knex("customcmd").where({ cmd: customCmd })
      if (data.length > 0) {
        const randomValue = Math.floor(Math.random() * data.length)
        message.channel.send({ content: data[randomValue].value })
      }
    }

    if (command) {
      const isDevOnly = command?.devOnly
      const isNeedParam = command?.fullCommand
      const isPossibleToSkip = command?.isPossibleToSkip
      const needPermission = command?.permission
      if (needPermission && !message.member.permissions.has(needPermission)) {
        throw new Error("Permission Denied")
      } else if (isDevOnly && !this.client.owners.includes(message.author.id)) {
        throw new Error("Not Owner")
      } else if (args.length < 1 && isNeedParam && !isPossibleToSkip) {
        const embed = new MessageEmbed()
          .setDescription(
            `명령어 실행을 위한 인자가 누락되었어요!\n사용법: \`${command.fullCommand}\``
          )
          .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL() })
          .setTimestamp(new Date())
          .setColor("#FF4246")
        return message.reply({ embeds: [embed] })
      }
      command.run(message, args, embed)
    }
  }
}
