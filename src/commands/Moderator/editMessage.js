const Command = require("../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "메시지수정",
      aliases: ["메시지수정", "메세지수정", "메세지바꿔", "메시지바꿔"],
      description: "인증 메시지의 내용을 변경해요.",
      category: "개발자",
    })
  }

  async run(message, args, embed, knex) {
    const authentication = (await knex("authentication"))[0]

    if (this.owners.some((ownerID) => message.author.id.includes(ownerID))) {
      if (args.length < 1)
        return message.reply(
          "`하룬아 메시지수정 < 메시지 >` 가 올바른 명령어에요."
        )
      const channelID = authentication.channel
      const messageID = authentication.messageID
      const text = args.join(" ")

      this.client.channels.cache
        .get(channelID)
        .messages.fetch(messageID)
        .then(async (msg) => {
          msg.edit({ content: text })
          embed.setDescription(
            `완료되었습니다. [메시지 확인하기](https://discord.com/channels/861455901926883389/${channelID}/${messageID})`
          )
          message.reply({ embeds: [embed] })
        })
    } else {
      return message.reply("권한이 없어요.")
    }
  }
}
