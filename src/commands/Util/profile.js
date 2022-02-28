const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "프로필",
      aliases: ["프사", "아바타"],
      description: "대상의 프로필 사진을 크게 보여드려요.",
      category: "유틸리티",
    })
  }

  checkUser(message, user) {
    const searchById = this.client.users.cache.get(user)
    const searchByName = message.guild.members.cache.find((u) => u.displayName === user[0])

    console.log(searchByName)

    if (user.length === 0 || (searchById === undefined && searchByName === undefined))
      return message.user

    if (searchById === undefined) return searchByName.user
    else return searchById
  }

  async run(message, args, embed) {
    const user =
      args.length !== 0
        ? message.mentions.users.first()
          ? message.mentions.users.first()
          : this.checkUser(message, args)
        : message.author
    embed.setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
    embed.setFooter({ text: user.username + "님의 프로필!" })
    message.reply({ embeds: [embed] })
  }
}
