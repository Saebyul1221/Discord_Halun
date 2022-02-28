const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "메시지수정",
      aliases: ["메시지수정", "메세지수정", "메세지바꿔", "메시지바꿔"],
      description: "인증 메시지의 내용을 변경해요.",
      category: "관리자",
      devOnly: true,
      fullCommand: "하룬아 메시지수정 < 메시지 >",
    })
  }

  async run(message, args, embed) {
    const authentication = (await this.client.knex("authentication"))[0]
    const channelID = authentication.channel
    const messageID = authentication.messageID
    const text = args.join(" ")

    this.client.channels.cache
      .get(channelID)
      .messages.fetch(messageID)
      .then(async (msg) => {
        msg.edit({ content: text })
        embed.setDescription(
          `수정이 완료되었어요! [메시지 확인하기](https://discord.com/channels/861455901926883389/${channelID}/${messageID})`
        )
        message.reply({ embeds: [embed] })
      })
  }
}
